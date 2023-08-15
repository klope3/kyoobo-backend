import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { prisma } from "../client";
import {
  INTERNAL_SERVER_ERROR,
  NOT_AUTHENTICATED,
  OK,
  RESOURCE_CONFLICT,
} from "../statusCodes";
import { message } from "../utility";
import bcrypt from "bcrypt";
import { createUserToken, hashPassword } from "../authUtils";

export const authRouter = express.Router();

//login
authRouter.post(
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
authRouter.post(
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
