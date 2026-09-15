/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/

-- Add userId initially allowing NULL
ALTER TABLE "Book"
ADD COLUMN "userId" INTEGER;

-- Make User.name required
ALTER TABLE "User"
ALTER COLUMN "name" SET NOT NULL;

-- Assign existing books to admin
UPDATE "Book"
SET "userId" = (
    SELECT "id"
    FROM "User"
    WHERE "email" = 'admin@bookshelf.com'
)
WHERE "userId" IS NULL;

-- userId becomes required
ALTER TABLE "Book"
ALTER COLUMN "userId" SET NOT NULL;

-- Index
CREATE INDEX "Book_userId_idx"
ON "Book"("userId");

-- Foreign key
ALTER TABLE "Book"
ADD CONSTRAINT "Book_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;