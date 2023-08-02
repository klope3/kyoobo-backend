// import { testUsers } from "../../seedData";
import { TestUser, seedDb } from "../../seedLogic";
import {
  BAD_REQUEST,
  NOT_AUTHENTICATED,
  NOT_FOUND,
  OK,
  RESOURCE_CONFLICT,
} from "../../statusCodes";
import {
  FixturesCommon,
  createAccountResponse,
  fetchUserResponse,
  getCommonFixtures,
  loginResponse,
  requestOptionsGet,
  seedTimeout,
  url,
} from "../testUtils";
import {
  validateCreateAccountJson,
  validateGetUserJson,
  validateLoginJson,
} from "../testValidations";

describe("GET /users/:userId", () => {
  let fixtures: FixturesCommon;

  beforeEach(async () => {
    fixtures = await getCommonFixtures();
  }, seedTimeout);

  it("should return JSON with id, username, email, and joinDate", async () => {
    const { testUser } = fixtures;
    const response = await fetchUserResponse(testUser.id);
    expect(response.status).toBe(OK);

    const json = await response.json();
    expect(validateGetUserJson(json)).toBe(true);
  });

  it("should return a 404 when an invalid user ID is requested", async () => {
    const response = await fetchUserResponse(0);
    expect(response.status).toBe(NOT_FOUND);
  });

  it("should return a BAD REQUEST response when a bad user ID is provided", async () => {
    const response = await fetch(`${url}/users/a`, requestOptionsGet);
    expect(response.status).toBe(BAD_REQUEST);
  });
});

describe("POST /login", () => {
  let fixtures: FixturesCommon;

  beforeEach(async () => {
    fixtures = await getCommonFixtures();
  }, seedTimeout);

  it("should return a JSON with username, email, and token", async () => {
    const { testUser } = fixtures;
    const response = await loginResponse(testUser.email, testUser.password);
    expect(response.status).toBe(OK);
    const json = await response.json();
    expect(validateLoginJson(json)).toBe(true);
  });

  it("should return NOT AUTHENTICATED when email isn't found in db", async () => {
    const { testUser } = fixtures;
    const response = await loginResponse("badEmail", testUser.password);
    expect(response.status).toBe(NOT_AUTHENTICATED);
  });
  it("should return NOT AUTHENTICATED when password is wrong", async () => {
    const { testUser } = fixtures;
    const response = await loginResponse(testUser.email, "blah");
    expect(response.status).toBe(NOT_AUTHENTICATED);
  });
});

describe("POST /users", () => {
  let fixtures: FixturesCommon;

  beforeEach(async () => {
    fixtures = await getCommonFixtures();
  }, seedTimeout);

  it(
    "should return JSON with token, username, and email when successful",
    async () => {
      const response = await createAccountResponse(
        "newUser@gmail.com",
        "newUser",
        "password1234"
      );
      expect(response.status).toBe(OK);
      const json = await response.json();
      expect(validateCreateAccountJson(json)).toBe(true);
    },
    seedTimeout
  );
  it(
    "should return RESOURCE CONFLICT when duplicate username/email is used",
    async () => {
      const { testUser } = fixtures;
      const response = await createAccountResponse(
        testUser.email,
        testUser.username,
        testUser.password
      );
      expect(response.status).toBe(RESOURCE_CONFLICT);
    },
    seedTimeout
  );
});
