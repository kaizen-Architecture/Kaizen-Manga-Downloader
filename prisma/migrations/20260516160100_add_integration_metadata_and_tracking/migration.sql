-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN "isRead" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Chapter" ADD COLUMN "lastReadAt" TIMESTAMP(3);
ALTER TABLE "Chapter" ADD COLUMN "metadataInjected" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Settings" ADD COLUMN "preferredMetadataLanguage" TEXT NOT NULL DEFAULT 'en';
