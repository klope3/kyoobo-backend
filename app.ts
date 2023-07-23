import express from "express";
import cors from "cors";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import { intParseableString } from "./validations";
import { prisma } from "./client";
import {
  INTERNAL_SERVER_ERROR,
  NOT_AUTHENTICATED,
  NOT_FOUND,
  OK,
  RESOURCE_CONFLICT,
} from "./statusCodes";
import { message } from "./utility";
import { createUserToken, hashPassword } from "./authUtils";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";

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

    res
      .status(OK)
      .send({
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
        characters: true,
        tiles: true,
        pickups: true,
      },
    });
    if (!level) {
      return res.status(NOT_FOUND).send(message("Level not found."));
    }
    res.status(OK).send(level);
  }
);

//TODO:get completions for level

//TODO:get completions for specific user

//TODO:get ratings for level

//TODO:get all ratings for specific user

//TODO:post level completion

//TODO:post level rating

//TODO:delete level rating

app.listen(3000);
