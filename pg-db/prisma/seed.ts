// Seeds one demo profile with 10 completed, rated interviews.
// Safe to re-run: the demo user and everything it owns is replaced each time.
// Usage (from pg-db/): DATABASE_URL=... bun run seed
import { prisma } from "../src/db";

const DEMO_EMAIL = "demo@aiinterviewer.dev";
const DEMO_PASSWORD = "demo!1234";
const DAY_MS = 24 * 60 * 60 * 1000;

const repos = [
  { name: "task-tracker", description: "Kanban style task manager with drag and drop", starcount: 14 },
  { name: "realtime-chat", description: "WebSocket chat app with rooms and presence", starcount: 31 },
  { name: "url-shortener", description: "URL shortener with Redis caching and analytics", starcount: 9 },
  { name: "expense-split", description: "Split group expenses and settle up", starcount: 6 },
];

const interviews = [
  { role: "Frontend Developer", score: 48, feedback: "Answers were short and lacked detail. Revisit React rendering basics and explain your project decisions more clearly." },
  { role: "Frontend Developer", score: 55, feedback: "Better structure. Explanations of state management were vague; practice walking through a concrete example." },
  { role: "Backend Developer", score: 52, feedback: "Knows the basics of REST, but struggled with database indexing and transaction questions." },
  { role: "Backend Developer", score: 61, feedback: "Good explanation of the URL shortener caching layer. Needs more depth on failure handling." },
  { role: "Full Stack Developer", score: 58, feedback: "Solid on the frontend, weaker on deployment and scaling. Communication is improving." },
  { role: "Full Stack Developer", score: 66, feedback: "Clear walkthrough of the chat app architecture. Could discuss trade-offs more." },
  { role: "Backend Developer", score: 71, feedback: "Confident with SQL and caching. Good use of examples from own projects." },
  { role: "Frontend Developer", score: 69, feedback: "Strong component design answers. Performance optimisation answers were partly correct." },
  { role: "Full Stack Developer", score: 77, feedback: "Well structured answers with clear trade-offs. Minor gaps on testing strategy." },
  { role: "Backend Developer", score: 82, feedback: "Excellent depth on concurrency and data consistency. Ready for mid-level interviews." },
];

function transcript(role: string, repoName: string) {
  return [
    { type: "AIassistent" as const, text: `Hi, thanks for joining. This is a ${role} interview. Tell me something about yourself.` },
    { type: "User" as const, text: "I'm a developer who mostly builds web apps. I enjoy working across the stack and shipping side projects." },
    { type: "AIassistent" as const, text: `I see ${repoName} on your GitHub. What problem does it solve and how is it structured?` },
    { type: "User" as const, text: `${repoName} has a React frontend and an Express API backed by Postgres. I split it into a few services to keep things simple to deploy.` },
    { type: "AIassistent" as const, text: "What was the hardest bug you hit in that project, and how did you fix it?" },
    { type: "User" as const, text: "A race condition when two requests updated the same record. I fixed it with a conditional update inside a transaction." },
    { type: "AIassistent" as const, text: "Thanks, that's all the time we have. Good luck!" },
  ];
}

async function main() {
  const password = await Bun.password.hash(DEMO_PASSWORD, { algorithm: "bcrypt", cost: 10 });

  await prisma.$transaction(async (tx) => {
    const existing = await tx.user.findUnique({ where: { email: DEMO_EMAIL } });
    if (existing) {
      await tx.messages.deleteMany({ where: { interview: { userID: existing.id } } });
      await tx.interview.deleteMany({ where: { userID: existing.id } });
      await tx.user.delete({ where: { id: existing.id } });
    }

    const user = await tx.user.create({
      data: { username: "Demo Candidate", email: DEMO_EMAIL, password, tokens: 5 },
    });

    // One interview roughly every 9 days, the latest yesterday.
    const now = Date.now();
    for (const [index, interview] of interviews.entries()) {
      const startedAt = new Date(now - (interviews.length - index) * 9 * DAY_MS + DAY_MS * 8);
      startedAt.setUTCHours(10 + (index % 6), 0, 0, 0);
      const repo = repos[index % repos.length]!;

      await tx.interview.create({
        data: {
          userID: user.id,
          status: "Ended",
          score: interview.score,
          feedback: interview.feedback,
          // Same shape /github-verification stores; the first repo is shown as the "role" in /user/interviews.
          githubmetadata: [repo, ...repos.filter((r) => r !== repo)],
          createdAt: startedAt,
          startedAt,
          messages: {
            create: transcript(interview.role, repo.name).map((message, i) => ({
              messages: message.text,
              type: message.type,
              sentAt: new Date(startedAt.getTime() + i * 45_000),
            })),
          },
        },
      });
    }
  });

  const user = await prisma.user.findUniqueOrThrow({
    where: { email: DEMO_EMAIL },
    include: { _count: { select: { Interview: true } } },
  });
  console.log(`Seeded ${user.email} (password: ${DEMO_PASSWORD}) with ${user._count.Interview} rated interviews.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
