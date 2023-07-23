import { User } from "@prisma/client";
import { hashSync } from "bcrypt";
import jwt from "jsonwebtoken";

const salt = 11;

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
  const secret = process.env.JWT_SECRET;
  return secret && jwt.sign(info, secret);
}
