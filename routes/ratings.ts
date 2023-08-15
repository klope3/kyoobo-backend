import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { prisma } from "../client";
import { NOT_FOUND, OK, RESOURCE_CONFLICT } from "../statusCodes";
import { message } from "../utility";
import { tryVerifyUser } from "../authUtils";

export const ratingsRouter = express.Router();

//post level rating
ratingsRouter.post(
  "/",
  validateRequest({
    body: z.object({
      userId: z.number().int(),
      levelId: z.number().int(),
      value: z.number().int().min(0).max(10),
    }),
  }),
  async (req, res) => {
    const { levelId, userId, value } = req.body;
    const levelWithId = await prisma.level.findUnique({
      where: {
        id: levelId,
      },
    });
    if (!levelWithId) {
      return res.status(NOT_FOUND).send(message("No level with that id."));
    }

    const userWithId = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!userWithId) {
      return res.status(NOT_FOUND).send(message("No user with that id."));
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

    const ratingWithUserAndLevelId = await prisma.levelRating.findFirst({
      where: {
        userId,
        levelId,
      },
    });

    if (ratingWithUserAndLevelId) {
      return res
        .status(RESOURCE_CONFLICT)
        .send(
          message(
            "That user has already rated that level. Use the PUT endpoint instead."
          )
        );
    }

    const createdRating = await prisma.levelRating.create({
      data: {
        value,
        levelId,
        userId,
      },
    });

    return res.status(OK).send(createdRating);
  }
);
