-- AlterTable
ALTER TABLE "Settings" ADD COLUMN "apiEnabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "apiToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_apiToken_key" ON "User"("apiToken");
