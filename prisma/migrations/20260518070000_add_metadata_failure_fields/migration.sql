-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN "metadataFailed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Chapter" ADD COLUMN "metadataError" TEXT;
