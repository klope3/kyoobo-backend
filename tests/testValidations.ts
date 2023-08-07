import { z } from "zod";
import { dateParseableString } from "../platformer-creator-game-shared/typesFetched";

export function parseTokenJson(json: any) {
  const schema = z.object({
    token: z.string(),
  });
  return schema.parse(json);
}

export function validateLoginJson(json: any) {
  const schema = z.strictObject({
    email: z.string(),
    username: z.string(),
    token: z.string(),
  });
  return schema.safeParse(json).success;
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

export function validateRatingJson(json: any) {
  const schema = z.strictObject({
    id: z.number(),
    userId: z.number(),
    levelId: z.number(),
    value: z.number(),
  });
  return schema.safeParse(json).success;
}

export function validateLevelResultsJson(json: any) {
  const dateParseableString = z
    .string()
    .refine((str) => !isNaN(new Date(str).getTime()));

  const schema = z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      private: z.boolean(),
      dateCreated: dateParseableString,
      dateUpdated: dateParseableString,
      userId: z.number(),
      user: z.object({
        username: z.string(),
      }),
      averageRating: z.number(),
      totalRatings: z.number(),
      totalCompletions: z.number(),
    })
  );
  return schema.safeParse(json).success;
}

export function validateLevelCompletionJson(json: any) {
  const schema = z.object({
    id: z.number(),
    userId: z.number(),
    levelId: z.number(),
    dateCompleted: dateParseableString,
    gameDuration: z.number(),
  });
  return schema.safeParse(json).success;
}
