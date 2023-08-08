import { z } from "zod";
import {
  fetchedLevelDataSchema,
  fetchedLevelResultSchema,
  levelCompletionSchema,
  ratingSchema,
  userSchema,
} from "../platformer-creator-game-shared/typesFetched";

export function parseTokenJson(json: any) {
  const schema = z.object({
    token: z.string(),
  });
  return schema.parse(json);
}

export function validateAuthJson(json: any) {
  const schema = z.strictObject({
    email: z.string(),
    username: z.string(),
    token: z.string(),
  });
  return schema.safeParse(json).success;
}

export function validateGetUserJson(json: any) {
  return userSchema.safeParse(json).success;
}

export function validateCreateAccountJson(json: any) {
  return validateAuthJson(json);
}

export function validateRatingJson(json: any) {
  return ratingSchema.safeParse(json).success;
}

export function validateLevelResultsJson(json: any) {
  const schema = z.array(fetchedLevelResultSchema);
  return schema.safeParse(json).success;
}

export function validateLevelDataJson(json: any) {
  return fetchedLevelDataSchema.safeParse(json).success;
}

export function validateLevelCompletionJson(json: any) {
  return levelCompletionSchema.safeParse(json).success;
}
