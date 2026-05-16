-- AlterTable
ALTER TABLE "Settings" ADD COLUMN "refreshStatusInterval" TEXT NOT NULL DEFAULT 'weekly',
ADD COLUMN "refreshStatusWindow" TEXT NOT NULL DEFAULT 'night';
