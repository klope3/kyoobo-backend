import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { intParseableString } from "../validations";
import { prisma } from "../client";
import { BAD_REQUEST, NOT_FOUND, OK } from "../statusCodes";
import { addCalculationsToLevel, message } from "../utility";
import { tryVerifyUser } from "../authUtils";

export const levelsRouter = express.Router();

//get level by id
levelsRouter.get(
  "/:levelId",
  validateRequest({
    params: z.object({
      levelId: intParseableString,
    }),
  }),
  async (req, res) => {
    const level = await prisma.level.findUnique({
      where: {
        id: +req.params.levelId,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        characters: true,
        tiles: true,
        pickups: true,
        completions: true,
        ratings: true,
      },
    });
    if (!level) {
      return res.status(NOT_FOUND).send(message("Level not found."));
    }
    const levelWithCalculations = addCalculationsToLevel(level);
    res.status(OK).send(levelWithCalculations);
  }
);

levelsRouter.get("/", async (req, res) => {
  const levels = await prisma.level.findMany({
    include: {
      user: {
        select: {
          username: true,
        },
      },
      completions: true,
      ratings: true,
    },
  });

  const levelsWithCalculations = levels.map(addCalculationsToLevel);

  res.status(OK).send(levelsWithCalculations);
});

//get completions for level
levelsRouter.get(
  "/:levelId/completions",
  validateRequest({
    params: z.object({
      levelId: intParseableString,
    }),
  }),
  async (req, res) => {
    const levelId = +req.params.levelId;
    const level = await prisma.level.findUnique({
      where: {
        id: levelId,
      },
    });
    if (!level) {
      return res
        .status(NOT_FOUND)
        .send(message("No level with that id was found."));
    }
    const completionsForLevel = await prisma.levelCompletion.findMany({
      where: {
        levelId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    return res.status(OK).send(completionsForLevel);
  }
);

//post level completion
levelsRouter.post(
  "/completions",
  validateRequest({
    body: z.object({
      userId: z.number().int(),
      levelId: z.number().int(),
      completionTime: z.number().int(),
      lives: z.number().int(),
      score: z.number().int(),
    }),
  }),
  async (req, res) => {
    const { completionTime, levelId, userId, lives, score } = req.body;

    const levelWithId = await prisma.level.findUnique({
      where: {
        id: levelId,
      },
    });

    if (!levelWithId) {
      return res
        .status(NOT_FOUND)
        .send(message("No level found with that id."));
    }

    if (completionTime <= 0) {
      return res
        .status(BAD_REQUEST)
        .send(message("Completion time must be greater than zero."));
    }

    const verifyUserResult = await tryVerifyUser(
      userId,
      req.headers.authorization
    );
    if (verifyUserResult.error) {
      return res
        .status(verifyUserResult.status)
        .send(message(verifyUserResult.error));
    }

    const createdCompletion = await prisma.levelCompletion.create({
      data: {
        dateCompleted: new Date(),
        gameDuration: completionTime,
        userId,
        levelId,
        lives,
        score,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.status(OK).send(createdCompletion);
  }
);
