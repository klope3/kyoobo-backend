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

export function validateCreateAccountJson(json: any) {
  const schema = z.strictObject({
    email: z.string(),
    username: z.string(),
    token: z.string(),
  });
  return schema.safeParse(json).success;
}

export function validateGetRatingJson(json: any) {
  const schema = z.strictObject({
    id: z.number(),
    userId: z.number(),
    levelId: z.number(),
    value: z.number(),
  });
  return schema.safeParse(json).success;
}
