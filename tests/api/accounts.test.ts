import { testUsers } from "../../seedData";
import { BAD_REQUEST, NOT_FOUND } from "../../statusCodes";
import { parseObjWithId } from "../../validations";
import { parseTokenJson, validateGetUserJson } from "../testValidations";
import jwtDecode from "jwt-decode";
import { fetchUser, requestOptionsGet, url } from "../testUtils";
// const fetch = require("node-fetch").default;
// const { Headers } = fetch;

let authToken = "";
let testUserId = 0;
const testUser = testUsers[0];

beforeAll(async () => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const body = JSON.stringify({
    email: testUsers[0].email,
    password: testUsers[0].password,
  });
  const requestOptions = {
    method: "POST",
    headers,
    body,
  };

  const response = await fetch(`${url}/login`, requestOptions);
  if (!response.ok) {
    throw new Error(
      `The fetch request for getting a token failed: ${response.statusText}`
    );
  }
  const json = await response.json();
  const parsedTokenJson = parseTokenJson(json);
  authToken = parsedTokenJson.token;

  const decoded = jwtDecode(authToken);
  const parsedDecoded = parseObjWithId(decoded);
  testUserId = parsedDecoded.id;
});

describe("GET /users/:userId", () => {
  it("should return JSON with id, username, email, and joinDate", async () => {
    const response = await fetchUser(testUserId);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(validateGetUserJson(json)).toBe(true);
  });

  it("should return a 404 when an invalid user ID is requested", async () => {
    const response = await fetchUser(0);
    expect(response.status).toBe(NOT_FOUND);
  });

  it("should return a BAD REQUEST response when a bad user ID is provided", async () => {
    const response = await fetch(`${url}/users/a`, requestOptionsGet);
    expect(response.status).toBe(BAD_REQUEST);
  });
});
