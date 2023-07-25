/*
  Warnings:

  - Added the required column `userId` to the `Level` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Level" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "private" BOOLEAN NOT NULL,
    "dateCreated" DATETIME NOT NULL,
    "dateUpdated" DATETIME NOT NULL,
    "goalPositionX" INTEGER NOT NULL,
    "goalPositionY" INTEGER NOT NULL,
    "playerPositionX" INTEGER NOT NULL,
    "playerPositionY" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Level_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Level" ("dateCreated", "dateUpdated", "description", "goalPositionX", "goalPositionY", "id", "playerPositionX", "playerPositionY", "private", "title") SELECT "dateCreated", "dateUpdated", "description", "goalPositionX", "goalPositionY", "id", "playerPositionX", "playerPositionY", "private", "title" FROM "Level";
DROP TABLE "Level";
ALTER TABLE "new_Level" RENAME TO "Level";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
