-- Delete duplicates
DELETE FROM "Chapter"
WHERE id IN (
    SELECT id
    FROM (
        SELECT id,
        ROW_NUMBER() OVER (PARTITION BY "mangaId", "fileName" ORDER BY id) AS row_num
        FROM "Chapter"
    ) t
    WHERE t.row_num > 1
);

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_mangaId_fileName_key" ON "Chapter"("mangaId", "fileName");
