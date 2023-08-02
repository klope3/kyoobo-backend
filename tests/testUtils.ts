import "dotenv/config";
import { TestUser, seedDb } from "../seedLogic";
import { Level } from "@prisma/client";

export const url = process.env.SERVER_URL;
if (!url) throw new Error("No server url!");

export const requestOptionsGet = {
  method: "GET",
};

export const seedTimeout = 15000;

export type FixturesCommon = {
  testUser: TestUser;
  testLevel: Level;
};

export async function getCommonFixtures(): Promise<FixturesCommon> {
  const seedData = await seedDb();
  if (!seedData) throw new Error("Failed to seed before a test");
  return {
    testLevel: seedData.createdLevels[0],
    testUser: seedData.createdTestUsers[0],
  };
}

function createAuthHeaders(token: string, includeHeaderForPosting = false) {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  if (includeHeaderForPosting)
    headers.append("Content-Type", "application/json");
  return headers;
}

export async function fetchUserResponse(id: number) {
  const requestOptions = {
    method: "GET",
  };

  return fetch(`${url}/users/${id}`, requestOptions);
}

export async function loginResponse(email: string, password: string) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const body = JSON.stringify({
    email,
    password,
  });
  const requestOptions = {
    method: "POST",
    headers,
    body,
  };
  return fetch(`${url}/login`, requestOptions);
}

export async function createAccountResponse(
  email: string,
  username: string,
  password: string
) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const body = JSON.stringify({
    email,
    password,
    username,
  });
  const requestOptions = {
    method: "POST",
    headers,
    body,
  };
  return fetch(`${url}/users`, requestOptions);
}

export function getRatingResponse(
  userId: number,
  levelId: number,
  token: string
) {
  const headers = createAuthHeaders(token);
  const requestOptions = {
    method: "GET",
    headers,
  };
  return fetch(`${url}/users/${userId}/ratings/${levelId}`, requestOptions);
}

export function postRatingResponse(
  userId: number,
  levelId: number,
  token: string,
  value: number
) {
  const headers = createAuthHeaders(token, true);
  const body = JSON.stringify({
    userId,
    levelId,
    value,
  });
  const requestOptions = {
    method: "POST",
    headers,
    body,
  };

  return fetch(`${url}/ratings/`, requestOptions);
}

export function deleteRatingResponse(
  userId: number,
  levelId: number,
  token: string
) {
  const headers = createAuthHeaders(token);
  const requestOptions = {
    method: "DELETE",
    headers,
  };
  return fetch(`${url}/users/${userId}/ratings/${levelId}`, requestOptions);
}

export function updateRatingResponse(
  userId: number,
  levelId: number,
  token: string,
  newValue: number
) {
  const headers = createAuthHeaders(token, true);
  const body = JSON.stringify({
    value: newValue,
  });
  const requestOptions = {
    method: "PUT",
    headers,
    body,
  };
  return fetch(`${url}/users/${userId}/ratings/${levelId}`, requestOptions);
}

export function getLevelResponse(id?: number) {
  return fetch(`${url}/levels${id ? id : ""}`, requestOptionsGet);
}

export function postLevelCompletionResponse(
  userId: number,
  levelId: number,
  token: string,
  completionTime: number
) {
  const headers = createAuthHeaders(token, true);
  const body = JSON.stringify({
    userId,
    levelId,
    completionTime,
  });
  const requestOptions = {
    method: "POST",
    headers,
    body,
  };
  return fetch(`${url}/levels/completions`, requestOptions);
}
