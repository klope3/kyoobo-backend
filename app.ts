import express from "express";
import cors from "cors";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import { intParseableString } from "./validations";
import { prisma } from "./client";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_AUTHENTICATED,
  NOT_FOUND,
  OK,
  RESOURCE_CONFLICT,
} from "./statusCodes";
import { addCalculationsToLevel, message } from "./utility";
import { createUserToken, hashPassword, tryVerifyUser } from "./authUtils";
import bcrypt from "bcrypt";
import { Prisma, User } from "@prisma/client";

const app = express();
app.use(express.json());
app.use(cors());

//login
app.post(
  "/login",
  validateRequest({
    body: z.object({
      email: z.string(),
      password: z.string(),
    }),
  }),
  async (req, res) => {
    const userWithEmail = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (!userWithEmail) {
      return res
        .status(NOT_AUTHENTICATED)
        .send(message("Invalid credentials."));
    }

    const isCorrectPassword = await bcrypt.compare(
      req.body.password,
      userWithEmail.passwordHash
    );

    if (!isCorrectPassword) {
      return res
        .status(NOT_AUTHENTICATED)
        .send(message("Invalid credentials."));
    }

    const token = createUserToken(userWithEmail);

    if (!token) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send("There was a server error.");
    }

    res.status(OK).send({
      token,
      username: userWithEmail.username,
      email: userWithEmail.email,
    });
  }
);

//create account
app.post(
  "/users",
  validateRequest({
    body: z.object({
      username: z.string(),
      email: z.string(),
      password: z.string(),
    }),
  }),
  async (req, res) => {
    const userWithEmail = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });
    const userWithUsername = await prisma.user.findFirst({
      where: {
        username: req.body.username,
      },
    });
    if (userWithEmail || userWithUsername) {
      const conflictWord = userWithEmail ? "email" : "username";
      return res
        .status(RESOURCE_CONFLICT)
        .send(message(`A user with that ${conflictWord} already exists.`));
    }

    const hash = hashPassword(req.body.password);

    const createdUser = await prisma.user.create({
      data: {
        email: req.body.email,
        joinDate: new Date(),
        passwordHash: hash,
        username: req.body.username,
      },
    });

    const token = createUserToken(createdUser);

    if (!token) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send(message("There was a server error."));
    }

    return res.status(OK).send({
      token,
      username: createdUser.username,
      email: createdUser.email,
    });
  }
);

//get user info by id
//TODO: If this EVER returns sensitive user info, it will require authorization
app.get(
  "/users/:userId",
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

//get level by id
app.get(
  "/levels/:levelId",
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

//get levels
//TODO: allow searching, pagination, filtering, etc.
app.get("/levels", async (req, res) => {
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

//TODO:get completions for level

//TODO:get completions for specific user

//TODO:get ratings for level

//TODO:get all ratings for specific user

//TODO:get specific user's rating for specific level
app.get(
  "/users/:userId/ratings/:levelId",
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

//TODO:post level completion
app.post(
  "/levels/completions",
  validateRequest({
    body: z.object({
      userId: z.number().int(),
      levelId: z.number().int(),
      completionTime: z.number().int(),
    }),
  }),
  async (req, res) => {
    const { completionTime, levelId, userId } = req.body;

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

    //TODO: include an "isFastest" property in the response to indicate if this is the user's personal best
    const createdCompletion = await prisma.levelCompletion.create({
      data: {
        dateCompleted: new Date(),
        gameDuration: completionTime,
        userId,
        levelId,
      },
    });

    res.status(OK).send(createdCompletion);
  }
);

//TODO:post level rating
app.post(
  "/ratings",
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

//TODO:delete level rating
app.delete(
  "/users/:userId/ratings/:levelId",
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
    //TODO: The above section of code (and probably others) is repeated in other endpoint(s). Should probably make one function in a dbUtils.ts.
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

//TODO:update level rating
app.put(
  "/users/:userId/ratings/:levelId",
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

app.listen(3000);
