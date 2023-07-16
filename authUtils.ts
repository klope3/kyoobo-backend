import { hashSync } from "bcrypt";

const salt = 11;

export function hashPassword(password: string) {
  return hashSync(password, salt);
}
