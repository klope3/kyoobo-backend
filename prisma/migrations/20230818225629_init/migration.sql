-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "joinDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Level" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "private" BOOLEAN NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL,
    "dateUpdated" TIMESTAMP(3) NOT NULL,
    "goalPositionX" INTEGER NOT NULL,
    "goalPositionY" INTEGER NOT NULL,
    "playerPositionX" INTEGER NOT NULL,
    "playerPositionY" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LevelRating" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "levelId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "LevelRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LevelCompletion" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "levelId" INTEGER NOT NULL,
    "dateCompleted" TIMESTAMP(3) NOT NULL,
    "gameDuration" INTEGER NOT NULL,
    "lives" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "LevelCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LevelTile" (
    "id" SERIAL NOT NULL,
    "positionX" INTEGER NOT NULL,
    "positionY" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "levelId" INTEGER NOT NULL,

    CONSTRAINT "LevelTile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LevelPickup" (
    "id" SERIAL NOT NULL,
    "positionX" INTEGER NOT NULL,
    "positionY" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "levelId" INTEGER NOT NULL,

    CONSTRAINT "LevelPickup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LevelCharacter" (
    "id" SERIAL NOT NULL,
    "positionX" INTEGER NOT NULL,
    "positionY" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "levelId" INTEGER NOT NULL,

    CONSTRAINT "LevelCharacter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Level" ADD CONSTRAINT "Level_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelRating" ADD CONSTRAINT "LevelRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelRating" ADD CONSTRAINT "LevelRating_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelCompletion" ADD CONSTRAINT "LevelCompletion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelCompletion" ADD CONSTRAINT "LevelCompletion_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelTile" ADD CONSTRAINT "LevelTile_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelPickup" ADD CONSTRAINT "LevelPickup_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelCharacter" ADD CONSTRAINT "LevelCharacter_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
