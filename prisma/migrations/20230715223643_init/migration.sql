-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "joinDate" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Level" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "private" BOOLEAN NOT NULL,
    "dateCreated" DATETIME NOT NULL,
    "dateUpdated" DATETIME NOT NULL,
    "goalPositionX" INTEGER NOT NULL,
    "goalPositionY" INTEGER NOT NULL,
    "playerPositionX" INTEGER NOT NULL,
    "playerPositionY" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "LevelRating" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "levelId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    CONSTRAINT "LevelRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LevelRating_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LevelCompletion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "levelId" INTEGER NOT NULL,
    "dateCompleted" DATETIME NOT NULL,
    "gameDuration" INTEGER NOT NULL,
    CONSTRAINT "LevelCompletion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LevelCompletion_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LevelTile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "positionX" INTEGER NOT NULL,
    "positionY" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "levelId" INTEGER NOT NULL,
    CONSTRAINT "LevelTile_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LevelPickup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "positionX" INTEGER NOT NULL,
    "positionY" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "levelId" INTEGER NOT NULL,
    CONSTRAINT "LevelPickup_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LevelCharacter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "positionX" INTEGER NOT NULL,
    "positionY" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "levelId" INTEGER NOT NULL,
    CONSTRAINT "LevelCharacter_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
