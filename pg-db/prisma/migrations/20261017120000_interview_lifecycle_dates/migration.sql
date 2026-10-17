-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "startedAt" TIMESTAMP(3);

-- Backfill: existing interviews had no dates, so use their first recorded message where available.
UPDATE "Interview" i
SET "createdAt" = m."firstSentAt",
    "startedAt" = m."firstSentAt"
FROM (
    SELECT "interviewid", MIN("sentAt") AS "firstSentAt"
    FROM "Messages"
    GROUP BY "interviewid"
) m
WHERE m."interviewid" = i."id";

-- Interviews whose transcript was already persisted were finalized by the websocket server
-- but never moved out of 'Inprocess'. Mark them so they can no longer be resumed.
UPDATE "Interview" i
SET "status" = 'Marking'
WHERE i."status" = 'Inprocess'
  AND EXISTS (SELECT 1 FROM "Messages" m WHERE m."interviewid" = i."id");
