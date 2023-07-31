import { Level, User, LevelRating, LevelCompletion } from "@prisma/client";
import { prisma } from "./client";
import { testLevels, testUsers } from "./seedData";
import { hashPassword } from "./authUtils";

async function eraseDb() {
  await prisma.levelCharacter.deleteMany();
  await prisma.levelPickup.deleteMany();
  await prisma.levelRating.deleteMany();
  await prisma.levelTile.deleteMany();
  await prisma.levelCompletion.deleteMany();
  await prisma.level.deleteMany();
  await prisma.user.deleteMany();
}

async function seedDb() {
  const createdLevels: Level[] = [];
  const createdUsers: User[] = [];
  //create users
  for (const user of testUsers) {
    const newUser = await prisma.user.create({
      data: {
        email: user.email,
        joinDate: user.joinDate,
        passwordHash: hashPassword(user.password),
        username: user.username,
      },
    });
    createdUsers.push(newUser);
  }
  //create levels with tiles, characters, and pickups
  for (const level of testLevels) {
    const newLevel = await prisma.level.create({
      data: {
        dateCreated: level.dateCreated,
        dateUpdated: level.dateUpdated,
        goalPositionX: level.goalPositionX,
        goalPositionY: level.goalPositionY,
        playerPositionX: level.playerPositionX,
        playerPositionY: level.playerPositionY,
        private: level.private,
        title: level.title,
        description: level.description,
        userId: createdUsers[0].id,
      },
    });
    createdLevels.push(newLevel);
    for (const character of level.characters) {
      await prisma.levelCharacter.create({
        data: {
          positionX: character.positionX,
          positionY: character.positionY,
          type: character.type,
          levelId: newLevel.id,
        },
      });
    }
    for (const tile of level.tiles) {
      await prisma.levelTile.create({
        data: {
          positionX: tile.positionX,
          positionY: tile.positionY,
          type: tile.type,
          levelId: newLevel.id,
        },
      });
    }
    for (const pickup of level.pickups) {
      await prisma.levelPickup.create({
        data: {
          positionX: pickup.positionX,
          positionY: pickup.positionY,
          type: pickup.type,
          levelId: newLevel.id,
        },
      });
    }
  }
  //create ratings
  const ratings: Omit<LevelRating, "id">[] = [
    {
      levelId: createdLevels[0].id,
      userId: createdUsers[1].id,
      value: 7,
    },
    {
      levelId: createdLevels[0].id,
      userId: createdUsers[0].id,
      value: 4,
    },
    {
      levelId: createdLevels[1].id,
      userId: createdUsers[0].id,
      value: 3,
    },
    {
      levelId: createdLevels[1].id,
      userId: createdUsers[1].id,
      value: 9,
    },
  ];

  for (const rating of ratings) {
    await prisma.levelRating.create({
      data: {
        value: rating.value,
        userId: rating.userId,
        levelId: rating.levelId,
      },
    });
  }
  //create completions
  const completions: Omit<LevelCompletion, "id">[] = [
    {
      dateCompleted: new Date(1689232445645),
      gameDuration: 45331,
      levelId: createdLevels[0].id,
      userId: createdUsers[0].id,
    },
    {
      dateCompleted: new Date(1689932445645),
      gameDuration: 144303,
      levelId: createdLevels[1].id,
      userId: createdUsers[0].id,
    },
    {
      dateCompleted: new Date(1684932445645),
      gameDuration: 53411,
      levelId: createdLevels[0].id,
      userId: createdUsers[1].id,
    },
    {
      dateCompleted: new Date(1687232445645),
      gameDuration: 64398,
      levelId: createdLevels[1].id,
      userId: createdUsers[1].id,
    },
  ];

  for (const completion of completions) {
    await prisma.levelCompletion.create({
      data: {
        dateCompleted: completion.dateCompleted,
        gameDuration: completion.gameDuration,
        levelId: completion.levelId,
        userId: completion.userId,
      },
    });
  }
}

eraseDb()
  .then(() => seedDb())
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
