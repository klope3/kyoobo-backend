import { Level, User, LevelRating, LevelCompletion } from "@prisma/client";
import { prisma } from "./client";
import { testLevels, testUsers } from "./seedData";
import { createUserToken, hashPassword } from "./authUtils";

async function eraseDb() {
  console.log("Erasing");
  await prisma.levelCharacter.deleteMany();
  await prisma.levelPickup.deleteMany();
  await prisma.levelRating.deleteMany();
  await prisma.levelTile.deleteMany();
  await prisma.levelCompletion.deleteMany();
  await prisma.level.deleteMany();
  await prisma.user.deleteMany();
}

export type TestUser = Omit<User, "passwordHash"> & {
  token: string;
  password: string;
};

async function writeDb() {
  console.log("Writing seed data");
  const createdLevels: Level[] = [];
  const createdTestUsers: TestUser[] = [];
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
    const token = createUserToken(newUser);
    if (!token) throw new Error("Couldn't create a user token while seeding");

    createdTestUsers.push({ ...newUser, token, password: user.password });
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
        userId: createdTestUsers[0].id,
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
      userId: createdTestUsers[1].id,
      value: 7,
    },
    {
      levelId: createdLevels[0].id,
      userId: createdTestUsers[0].id,
      value: 4,
    },
    {
      levelId: createdLevels[1].id,
      userId: createdTestUsers[0].id,
      value: 3,
    },
    {
      levelId: createdLevels[1].id,
      userId: createdTestUsers[1].id,
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
      userId: createdTestUsers[0].id,
      lives: 2,
      score: 400,
    },
    {
      dateCompleted: new Date(1689932445645),
      gameDuration: 144303,
      levelId: createdLevels[1].id,
      userId: createdTestUsers[0].id,
      lives: 3,
      score: 1200,
    },
    {
      dateCompleted: new Date(1684932445645),
      gameDuration: 53411,
      levelId: createdLevels[0].id,
      userId: createdTestUsers[1].id,
      lives: 1,
      score: 1300,
    },
    {
      dateCompleted: new Date(1687232445645),
      gameDuration: 64398,
      levelId: createdLevels[1].id,
      userId: createdTestUsers[1].id,
      lives: 2,
      score: 2100,
    },
  ];

  for (const completion of completions) {
    await prisma.levelCompletion.create({
      data: {
        dateCompleted: completion.dateCompleted,
        gameDuration: completion.gameDuration,
        levelId: completion.levelId,
        userId: completion.userId,
        lives: completion.lives,
        score: completion.score,
      },
    });
  }

  return {
    createdLevels,
    createdTestUsers,
  };
}

export function seedDb() {
  return eraseDb()
    .then(() => writeDb())
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
}
