import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { prisma } from "../client";
import { intParseableString } from "../validations";
import { NOT_FOUND, OK } from "../statusCodes";
import { message } from "../utility";
import { User } from "@prisma/client";
import { tryVerifyUser } from "../authUtils";

export const usersRouter = express.Router();

//get user info by id
usersRouter.get(
  "/:userId",
  validateRequest({ params: z.object({ userId: intParseableString }) }),
  async (req, res) => {
    const userWithId = await prisma.user.findUnique({
      where: {
        id: +req.params.userId,
      },
    });

    if (!userWithId) {
      return res
        .status(NOT_FOUND)
        .send(message("User " + req.params.userId + " not found."));
    }

    type UserWithoutPassword = Omit<User, "passwordHash">;

    const userInfo: UserWithoutPassword = {
      email: userWithId.email,
      id: userWithId.id,
      joinDate: userWithId.joinDate,
      username: userWithId.username,
    };

    return res.status(OK).send(userInfo);
  }
);

//get specific user's rating for specific level
usersRouter.get(
  "/:userId/ratings/:levelId",
  validateRequest({
    params: z.object({
      userId: intParseableString,
      levelId: intParseableString,
    }),
  }),
  async (req, res) => {
    const { userId, levelId } = req.params;

    const { error, status } = await tryVerifyUser(
      +userId,
      req.headers.authorization
    );
    if (error) {
      return res.status(status).send(message(error));
    }

    const ratingWithUserAndLevelId = await prisma.levelRating.findFirst({
      where: {
        levelId: +levelId,
        userId: +userId,
      },
    });

    if (!ratingWithUserAndLevelId) {
      return res
        .status(NOT_FOUND)
        .send(message("No user with that id has rated a level with that id."));
    }

    return res.status(OK).send(ratingWithUserAndLevelId);
  }
);

//delete level rating
usersRouter.delete(
  "/:userId/ratings/:levelId",
  validateRequest({
    params: z.object({
      userId: intParseableString,
      levelId: intParseableString,
    }),
  }),
  async (req, res) => {
    const { userId, levelId } = req.params;
    const ratingWithUserAndLevelId = await prisma.levelRating.findFirst({
      where: {
        userId: +userId,
        levelId: +levelId,
      },
    });
    if (!ratingWithUserAndLevelId) {
      return res
        .status(NOT_FOUND)
        .send(message("No user with that id has rated a level with that id."));
    }
    const { error, status } = await tryVerifyUser(
      +userId,
      req.headers.authorization
    );
    if (error) {
      return res.status(status).send(message(error));
    }

    const deletedRating = await prisma.levelRating.delete({
      where: {
        id: ratingWithUserAndLevelId.id,
      },
    });
    return res.status(OK).send(deletedRating);
  }
);

//update level rating
usersRouter.put(
  "/:userId/ratings/:levelId",
  validateRequest({
    params: z.object({
      userId: intParseableString,
      levelId: intParseableString,
    }),
    body: z.object({
      value: z.number().int().min(0).max(10),
    }),
  }),
  async (req, res) => {
    const { userId, levelId } = req.params;
    const { value: newValue } = req.body;
    const ratingWithUserAndLevelId = await prisma.levelRating.findFirst({
      where: {
        userId: +userId,
        levelId: +levelId,
      },
    });
    if (!ratingWithUserAndLevelId) {
      return res
        .status(NOT_FOUND)
        .send(
          message(
            "No user with that id has rated a level with that id. If you want to create a new rating, use the POST endpoint."
          )
        );
    }

    const { error, status } = await tryVerifyUser(
      +userId,
      req.headers.authorization
    );
    if (error) {
      return res.status(status).send(message(error));
    }

    const updatedRating = await prisma.levelRating.update({
      where: {
        id: ratingWithUserAndLevelId.id,
      },
      data: {
        ...ratingWithUserAndLevelId,
        value: newValue,
      },
    });

    return res.status(OK).send(updatedRating);
  }
);
