-- CreateTable
CREATE TABLE "MangaSource" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mangaId" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MangaSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MangaSource_mangaId_source_key" ON "MangaSource"("mangaId", "source");

-- AddForeignKey
ALTER TABLE "MangaSource" ADD CONSTRAINT "MangaSource_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "Manga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DataMigration: Copy existing sources to the new table
INSERT INTO "MangaSource" ("mangaId", "source", "title", "priority")
SELECT "id", "source", "title", 0 FROM "Manga";
