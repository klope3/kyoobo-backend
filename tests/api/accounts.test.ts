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
  createAccountResponse,
  fetchUserResponse,
  loginResponse,
  requestOptionsGet,
  url,
} from "../testUtils";
import {
  validateCreateAccountJson,
  validateGetUserJson,
} from "../testValidations";
const timeout = 15000;

async function getUserFixture() {
  const seedData = await seedDb();
  if (!seedData) throw new Error("Failed to seed before a test");
  return seedData.createdTestUsers[0];
}

describe("GET /users/:userId", () => {
  let testUser: TestUser;

  beforeEach(async () => {
    testUser = await getUserFixture();
  }, timeout);

  it("should return JSON with id, username, email, and joinDate", async () => {
    // const testUser = await getTestUserData();
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

//note: the normal behavior for this endpoint has already been tested by getting the auth token above
describe("POST /login", () => {
  let testUser: TestUser;

  beforeEach(async () => {
    testUser = await getUserFixture();
  }, timeout);

  it("should return NOT AUTHENTICATED when email isn't found in db", async () => {
    // const testUser = await getTestUserData();
    const response = await loginResponse("badEmail", testUser.password);
    expect(response.status).toBe(NOT_AUTHENTICATED);
  });
  it("should return NOT AUTHENTICATED when password is wrong", async () => {
    // const testUser = await getTestUserData();
    const response = await loginResponse(testUser.email, "blah");
    expect(response.status).toBe(NOT_AUTHENTICATED);
  });
});

describe("POST /users", () => {
  let testUser: TestUser;

  beforeEach(async () => {
    testUser = await getUserFixture();
  }, timeout);

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
    timeout
  );
  it(
    "should return RESOURCE CONFLICT when duplicate username/email is used",
    async () => {
      const response = await createAccountResponse(
        testUser.email,
        testUser.username,
        testUser.password
      );
      expect(response.status).toBe(RESOURCE_CONFLICT);
    },
    timeout
  );
});
