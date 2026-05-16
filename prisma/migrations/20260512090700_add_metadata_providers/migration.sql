-- AlterTable
ALTER TABLE "Settings" ADD COLUMN "metadataProviders" TEXT[] DEFAULT ARRAY['anilist', 'mangadex']::TEXT[];
