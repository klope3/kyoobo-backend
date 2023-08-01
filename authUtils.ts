import { User } from "@prisma/client";
import { hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "./client";
import {
  BAD_REQUEST,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
} from "./statusCodes";
import { parseObjWithId } from "./validations";

const salt = 11;

function jwtSecret() {
  if (!process.env.JWT_SECRET) console.error("JWT secret is undefined!");
  return process.env.JWT_SECRET;
}

export function hashPassword(password: string) {
  return hashSync(password, salt);
}

function createUnsecuredUserInfo(user: User) {
  return {
    id: user.id,
  };
}

export function createUserToken(user: User) {
  const info = createUnsecuredUserInfo(user);
  const secret = jwtSecret();
  return secret && jwt.sign(info, secret);
}

export async function tryVerifyUser(
  userId: number,
  authStr: string | undefined
): Promise<{ status: number; error: string | undefined }> {
  const userWithId = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!userWithId) {
    return {
      error: "No user with that id.",
      status: NOT_FOUND,
    };
  }

  const split = authStr?.split(" ");

  if (!split || split.length < 2) {
    return {
      error: "Bad token. Incorrect formatting.",
      status: BAD_REQUEST,
    };
  }

  const token = split[1];
  try {
    const secret = jwtSecret();
    if (!secret) {
      return {
        error: "There was a server error.",
        status: INTERNAL_SERVER_ERROR,
      };
    }
    const verified = jwt.verify(token, secret);
    const parsed = parseObjWithId(verified);

    if (parsed.id !== userId) {
      return {
        error: "Bad credentials.",
        status: FORBIDDEN,
      };
    }
  } catch (error) {
    return {
      error: "Bad token. Couldn't parse a userId from the payload.",
      status: BAD_REQUEST,
    };
  }

  return {
    error: undefined,
    status: OK,
  };
}
