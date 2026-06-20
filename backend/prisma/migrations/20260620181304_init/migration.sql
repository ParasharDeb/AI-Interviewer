-- CreateEnum
CREATE TYPE "MessagesType" AS ENUM ('User', 'AIassistent');

-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('Pre', 'Inprocess', 'Ended');

-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "githubmetadata" JSONB NOT NULL,
    "status" "InterviewStatus" NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" TEXT NOT NULL,
    "messages" TEXT NOT NULL,
    "type" "MessagesType" NOT NULL,
    "interviewid" TEXT NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_interviewid_fkey" FOREIGN KEY ("interviewid") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
