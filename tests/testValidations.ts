import { z } from "zod";

export function parseTokenJson(json: any) {
  const schema = z.object({
    token: z.string(),
  });
  return schema.parse(json);
}

export function validateGetUserJson(json: any) {
  const schema = z.strictObject({
    email: z.string(),
    id: z.number(),
    joinDate: z.string(),
    username: z.string(),
  });
  return schema.safeParse(json).success;
}
