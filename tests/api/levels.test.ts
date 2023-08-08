import { BAD_REQUEST, FORBIDDEN, NOT_FOUND, OK } from "../../statusCodes";
import {
  FixturesCommon,
  getCommonFixtures,
  getLevelResponse,
  postLevelCompletionResponse,
  seedTimeout,
} from "../testUtils";
import {
  validateLevelCompletionJson,
  validateLevelDataJson,
  validateLevelResultsJson,
} from "../testValidations";

describe("GET /levels", () => {
  let fixtures: FixturesCommon;

  beforeEach(async () => {
    fixtures = await getCommonFixtures();
  }, seedTimeout);

  it("should return a properly formed array of level results", async () => {
    const response = await getLevelResponse();
    expect(response.status).toBe(OK);
    const json = await response.json();
    expect(validateLevelResultsJson(json)).toBe(true);
  });
});

describe("GET /levels/:levelId", () => {
  let fixtures: FixturesCommon;

  beforeEach(async () => {
    fixtures = await getCommonFixtures();
  }, seedTimeout);

  it("should return JSON with all the data for building and running a game level", async () => {
    const response = await getLevelResponse(fixtures.testLevel.id);
    expect(response.status).toBe(OK);
    const json = await response.json();
    expect(validateLevelDataJson(json)).toBe(true);
  });

  it("should return NOT FOUND when the level is not found", async () => {
    const response = await getLevelResponse(0);
    expect(response.status).toBe(NOT_FOUND);
  });
});

describe("POST /levels/completions", () => {
  let fixtures: FixturesCommon;
  const time = 12345;

  beforeEach(async () => {
    fixtures = await getCommonFixtures();
  }, seedTimeout);

  it("should return properly formed JSON when the post is successful", async () => {
    const { testLevel, testUser } = fixtures;
    const response = await postLevelCompletionResponse(
      testUser.id,
      testLevel.id,
      testUser.token,
      time
    );
    expect(response.status).toBe(OK);
    const json = await response.json();
    expect(validateLevelCompletionJson(json)).toBe(true);
  });

  it("should return NOT FOUND when the user is not found", async () => {
    const { testLevel, testUser } = fixtures;
    const response = await postLevelCompletionResponse(
      0,
      testLevel.id,
      testUser.token,
      time
    );
    expect(response.status).toBe(NOT_FOUND);
  });

  it("should return NOT FOUND when the level is not found", async () => {
    const { testUser } = fixtures;
    const response = await postLevelCompletionResponse(
      testUser.id,
      0,
      testUser.token,
      time
    );
    expect(response.status).toBe(NOT_FOUND);
  });

  it("should return BAD REQUEST when the token is not given", async () => {
    const { testLevel, testUser } = fixtures;
    const response = await postLevelCompletionResponse(
      testUser.id,
      testLevel.id,
      "",
      time
    );
    expect(response.status).toBe(BAD_REQUEST);
  });

  it("should return FORBIDDEN when the user and token don't match", async () => {
    const { testLevel, testUser } = fixtures;
    const response = await postLevelCompletionResponse(
      testUser.id + 1,
      testLevel.id,
      testUser.token,
      time
    );
    expect(response.status).toBe(FORBIDDEN);
  });

  it("should return BAD REQUEST when the completion time is negative", async () => {
    const { testLevel, testUser } = fixtures;
    const response = await postLevelCompletionResponse(
      testUser.id,
      testLevel.id,
      testUser.token,
      -100
    );
    expect(response.status).toBe(BAD_REQUEST);
  });
});

//user not found
//level not found
//token not given
//token/user mismatch
//good response, good shape
