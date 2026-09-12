-- CreateTable
CREATE TABLE "ReadingHistory" (
    "id" SERIAL NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReadingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReadingHistory_bookId_completedAt_idx" ON "ReadingHistory"("bookId", "completedAt");

-- AddForeignKey
ALTER TABLE "ReadingHistory" ADD CONSTRAINT "ReadingHistory_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "ReadingHistory" (
    "bookId",
    "completedAt",
    "createdAt"
)
SELECT
    "id",
    "readAt",
    CURRENT_TIMESTAMP
FROM "Book"
WHERE "readAt" IS NOT NULL;