import jwt from "jsonwebtoken";
import { client } from "@repo/redis";
import { prisma, INTERVIEW_CREDIT_COST } from "@repo/db";

const JWT_SECRET = process.env.JWT_SECRET || " ";

// Only one live websocket session may drive an interview at a time.
export const SESSION_LOCK_TTL_MS = 60_000;

export interface Messagetype {
  Sender: "AI" | "CLIENT",
  Messages: string,
  createdAt: Date
}

export interface Rejection {
  code: number,
  error: string,
  message: string
}

export const Rejections = {
  Unauthorized: { code: 4001, error: "UNAUTHORIZED", message: "Please sign in again." },
  InsufficientCredits: { code: 4002, error: "INSUFFICIENT_CREDITS", message: "You do not have enough credits to start an interview." },
  NotFound: { code: 4004, error: "INTERVIEW_NOT_FOUND", message: "Interview not found." },
  AlreadyActive: { code: 4009, error: "INTERVIEW_ALREADY_ACTIVE", message: "This interview is already open in another window." },
  Ended: { code: 4010, error: "INTERVIEW_ENDED", message: "This interview has already ended and cannot be resumed." },
  StartFailed: { code: 4011, error: "INTERVIEW_START_FAILED", message: "The interview could not be started. You have not been charged." },
  SessionLost: { code: 4012, error: "INTERVIEW_SESSION_LOST", message: "The interview connection was lost. Reconnect to resume it." },
} satisfies Record<string, Rejection>;

type InterviewRecord = NonNullable<Awaited<ReturnType<typeof prisma.interview.findUnique>>>;

export type ClaimResult =
  | { ok: true, charged: boolean, remainingTokens: number | null, interview: InterviewRecord }
  | { ok: false, rejection: Rejection };

class InsufficientCreditsError extends Error {}

export function messagesKey(interviewId: string) {
  return `interview:${interviewId}:messages`;
}

function sessionKey(interviewId: string) {
  return `interview:${interviewId}:session`;
}

export function verifyToken(token: string | null): string | null {
  if (!token) {
    return null;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string };
    return decoded.userId ?? null;
  } catch {
    return null;
  }
}

const RENEW_LOCK_SCRIPT =
  'if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("pexpire", KEYS[1], ARGV[2]) else return 0 end';
const RELEASE_LOCK_SCRIPT =
  'if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end';

export async function acquireSessionLock(interviewId: string, owner: string) {
  const result = await client.set(sessionKey(interviewId), owner, "PX", SESSION_LOCK_TTL_MS, "NX");
  return result === "OK";
}

export async function renewSessionLock(interviewId: string, owner: string) {
  await client.eval(RENEW_LOCK_SCRIPT, 1, sessionKey(interviewId), owner, SESSION_LOCK_TTL_MS);
}

export async function releaseSessionLock(interviewId: string, owner: string) {
  await client.eval(RELEASE_LOCK_SCRIPT, 1, sessionKey(interviewId), owner);
}

// Decides whether this connection may run the interview. A Pre interview is started and charged
// in one transaction; an Inprocess interview is resumed for free; Marking/Ended are rejected.
export async function claimInterview(interviewId: string, userId: string, retried = false): Promise<ClaimResult> {
  const interview = await prisma.interview.findUnique({
    where: { id: interviewId }
  });

  // Same response for other users' interviews so IDs cannot be probed.
  if (!interview || interview.userID !== userId) {
    return { ok: false, rejection: Rejections.NotFound };
  }

  if (interview.status === "Marking" || interview.status === "Ended") {
    return { ok: false, rejection: Rejections.Ended };
  }

  if (interview.status === "Inprocess") {
    return { ok: true, charged: false, remainingTokens: null, interview };
  }

  let remainingTokens: number | null;
  try {
    remainingTokens = await prisma.$transaction(async (tx) => {
      // Conditional updates: concurrent claims block on the row lock and re-check the
      // WHERE clause, so only one of them can start the interview or take the credit.
      const claimed = await tx.interview.updateMany({
        where: { id: interviewId, userID: userId, status: "Pre" },
        data: { status: "Inprocess", startedAt: new Date() }
      });
      if (claimed.count === 0) {
        return null;
      }

      const charged = await tx.user.updateMany({
        where: { id: userId, tokens: { gte: INTERVIEW_CREDIT_COST } },
        data: { tokens: { decrement: INTERVIEW_CREDIT_COST } }
      });
      if (charged.count === 0) {
        throw new InsufficientCreditsError();
      }

      const user = await tx.user.findUniqueOrThrow({
        where: { id: userId },
        select: { tokens: true }
      });
      return user.tokens;
    });
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      return { ok: false, rejection: Rejections.InsufficientCredits };
    }
    throw error;
  }

  if (remainingTokens === null) {
    // Another request changed the status first; re-read it instead of charging again.
    if (retried) {
      return { ok: false, rejection: Rejections.AlreadyActive };
    }
    return claimInterview(interviewId, userId, true);
  }

  return { ok: true, charged: true, remainingTokens, interview };
}

// Undo a start whose live session never got going, so the user is not charged for it.
export async function refundUnstartedInterview(interviewId: string, userId: string) {
  await prisma.$transaction(async (tx) => {
    const reverted = await tx.interview.updateMany({
      where: { id: interviewId, userID: userId, status: "Inprocess" },
      data: { status: "Pre", startedAt: null }
    });
    if (reverted.count > 0) {
      await tx.user.update({
        where: { id: userId },
        data: { tokens: { increment: INTERVIEW_CREDIT_COST } }
      });
    }
  });
}

// Persist the end of the interview. Returns false if it had already ended.
export async function markInterviewEnding(interviewId: string) {
  const result = await prisma.interview.updateMany({
    where: { id: interviewId, status: "Inprocess" },
    data: { status: "Marking" }
  });
  return result.count > 0;
}

export async function loadSavedMessages(interviewId: string): Promise<Messagetype[]> {
  const raw = await client.lrange(messagesKey(interviewId), 0, -1);
  const messages: Messagetype[] = [];
  for (const entry of raw) {
    try {
      const parsed = JSON.parse(entry);
      if (typeof parsed?.message !== "string") {
        continue;
      }
      messages.push({
        Sender: parsed.sender === "AI" ? "AI" : "CLIENT",
        Messages: parsed.message,
        createdAt: new Date(parsed.createdAt)
      });
    } catch {
      console.warn("Skipping malformed saved message", interviewId);
    }
  }
  return messages;
}
