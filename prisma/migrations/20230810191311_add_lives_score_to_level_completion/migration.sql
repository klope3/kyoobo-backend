-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LevelCompletion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "levelId" INTEGER NOT NULL,
    "dateCompleted" DATETIME NOT NULL,
    "gameDuration" INTEGER NOT NULL,
    "lives" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "LevelCompletion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LevelCompletion_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LevelCompletion" ("dateCompleted", "gameDuration", "id", "levelId", "userId") SELECT "dateCompleted", "gameDuration", "id", "levelId", "userId" FROM "LevelCompletion";
DROP TABLE "LevelCompletion";
ALTER TABLE "new_LevelCompletion" RENAME TO "LevelCompletion";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
