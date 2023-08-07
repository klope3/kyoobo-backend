import { Level } from "@prisma/client";
import { TestUser, seedDb } from "../../seedLogic";
import {
  FixturesCommon,
  deleteRatingResponse,
  getCommonFixtures,
  getRatingResponse,
  postRatingResponse,
  seedTimeout,
  updateRatingResponse,
} from "../testUtils";
import { validateRatingJson } from "../testValidations";
import {
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  OK,
  RESOURCE_CONFLICT,
} from "../../statusCodes";
import { ZodError } from "zod";

describe("GET /users/:userId/ratings/:levelId (rating for specific user and specific level", () => {
  let fixtures: FixturesCommon;

  beforeEach(async () => {
    fixtures = await getCommonFixtures();
  }, seedTimeout);

  it("should return JSON with id, userId, levelId, and rating value", async () => {
    const { testUser, testLevel } = fixtures;
    const response = await getRatingResponse(
      testUser.id,
      testLevel.id,
      testUser.token
    );
    expect(response.status).toBe(OK);
    const json = await response.json();
    expect(validateRatingJson(json)).toBe(true);
  });

  it("should return a BAD REQUEST when the token is not provided", async () => {
    const { testUser, testLevel } = fixtures;
    const response = await getRatingResponse(testUser.id, testLevel.id, "");
    expect(response.status).toBe(BAD_REQUEST);
  });

  it("should return a NOT FOUND when the level and/or user is not found", async () => {
    const { testUser } = fixtures;
    const response = await getRatingResponse(0, 0, testUser.token);
    expect(response.status).toBe(NOT_FOUND);
  });

  it("should return a FORBIDDEN when the user id does not match the token", async () => {
    const { testUser, testLevel } = fixtures;
    const response = await getRatingResponse(
      testUser.id + 1,
      testLevel.id,
      testUser.token
    );
    // const response = await tokenUserIdMismatchFn(fixtures);
    expect(response.status).toBe(FORBIDDEN);
    // const response = await requestWithTokenUserIdMismatch(fixtures);
    // expect(response.status).toBe(FORBIDDEN);
  });
});

describe("DELETE /users/:userId/ratings/:levelId", () => {
  let fixtures: FixturesCommon;

  beforeEach(async () => {
    fixtures = await getCommonFixtures();
  }, seedTimeout);

  it("should return a JSON with id, userId, levelId, and value for the deleted rating", async () => {
    const { testUser, testLevel } = fixtures;
    const response = await deleteRatingResponse(
      testUser.id,
      testLevel.id,
      testUser.token
    );
    expect(response.status).toBe(OK);
    const json = await response.json();
    expect(validateRatingJson(json)).toBe(true);
  });

  it("should return a NOT FOUND when the user is not found", async () => {
    const { testUser, testLevel } = fixtures;
    const response = await deleteRatingResponse(
      0,
      testLevel.id,
      testUser.token
    );
    expect(response.status).toBe(NOT_FOUND);
  });

  it("should return a BAD REQUEST when the token is not provided", async () => {
    const { testUser, testLevel } = fixtures;
    const response = await deleteRatingResponse(testUser.id, testLevel.id, "");
    expect(response.status).toBe(BAD_REQUEST);
  });

  it("should return a FORBIDDEN when the token id doesn't match the user id", async () => {
    const { testUser, testLevel } = fixtures;
    const response = await deleteRatingResponse(
      testUser.id + 1,
      testLevel.id,
      testUser.token
    );
    expect(response.status).toBe(FORBIDDEN);
  });
});

describe("POST /ratings", () => {
  let fixtures: FixturesCommon;

  beforeEach(async () => {
    fixtures = await getCommonFixtures();
  }, seedTimeout);

  it("should return JSON with id, userId, levelId, and rating value for the created rating", async () => {
    const { testUser, testLevel } = fixtures;
    const rating = 7;
    const deleteResponse = await deleteRatingResponse(
      testUser.id,
      testLevel.id,
      testUser.token
    );
    if (!deleteResponse.ok)
      throw new Error(
        "Tried to delete a rating to make way for a new one, but there was an error."
      );
    const response = await postRatingResponse(
      testUser.id,
      testLevel.id,
      testUser.token,
      rating
    );
    expect(response.status).toBe(OK);
    const json = await response.json();
    expect(validateRatingJson(json)).toBe(true);
    expect(json.value).toBe(rating);
  });

  it("should return a NOT FOUND when the level is not found", async () => {
    const { testUser } = fixtures;
    const response = await postRatingResponse(
      testUser.id,
      0,
      testUser.token,
      7
    );
    expect(response.status).toBe(NOT_FOUND);
  });

  it("should return a NOT FOUND when the user is not found", async () => {
    const { testUser, testLevel } = fixtures;
    const response = await postRatingResponse(
      0,
      testLevel.id,
      testUser.token,
      7
    );
    expect(response.status).toBe(NOT_FOUND);
  });

  it("should return a BAD REQUEST when the token is not provided", async () => {
    const { testUser, testLevel } = fixtures;
    const response = await postRatingResponse(testUser.id, testLevel.id, "", 7);
    expect(response.status).toBe(BAD_REQUEST);
  });

  it("should return a FORBIDDEN when the token id does not match the requested id", async () => {
    const { testUser, testLevel } = fixtures;
    const response = await postRatingResponse(
      testUser.id + 1,
      testLevel.id,
      testUser.token,
      7
    );
    expect(response.status).toBe(FORBIDDEN);
  });

  it("should return a RESOURCE CONFLICT when trying to post a new rating for an already rated level", async () => {
    const { testUser, testLevel } = fixtures;
    await postRatingResponse(testUser.id, testLevel.id, testUser.token, 7);
    const response = await postRatingResponse(
      testUser.id,
      testLevel.id,
      testUser.token,
      6
    );
    expect(response.status).toBe(RESOURCE_CONFLICT);
  });
});

describe("PUT /users/:userId/ratings/:levelId", () => {
  let fixtures: FixturesCommon;

  beforeEach(async () => {
    fixtures = await getCommonFixtures();
  }, seedTimeout);

  it("should return a JSON with id, userId, levelId, and value for the updated rating", async () => {
    const { testUser, testLevel } = fixtures;
    const newValue = 5;
    const response = await updateRatingResponse(
      testUser.id,
      testLevel.id,
      testUser.token,
      newValue
    );
    expect(response.status).toBe(OK);
    const json = await response.json();
    expect(validateRatingJson(json)).toBe(true);
    expect(json.value).toBe(newValue);
  });

  it("should return a NOT FOUND when the level is not found", async () => {
    const { testUser, testLevel } = fixtures;
    const response = await updateRatingResponse(
      testUser.id,
      0,
      testUser.token,
      5
    );
    const json = await response.json();
    expect(response.status).toBe(NOT_FOUND);
  });

  it("should return a NOT FOUND when the user is not found", async () => {
    const { testUser, testLevel } = fixtures;
    const response = await updateRatingResponse(
      0,
      testLevel.id,
      testUser.token,
      5
    );
    expect(response.status).toBe(NOT_FOUND);
  });

  it("should return a BAD REQUEST when the token is not provided", async () => {
    const { testUser, testLevel } = fixtures;
    const response = await updateRatingResponse(
      testUser.id,
      testLevel.id,
      "",
      4
    );
    expect(response.status).toBe(BAD_REQUEST);
  });
});
