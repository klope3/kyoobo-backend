import { OK } from "../../statusCodes";
import {
  FixturesCommon,
  getCommonFixtures,
  getLevelResponse,
  seedTimeout,
} from "../testUtils";
import { validateLevelResultsJson } from "../testValidations";

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

  //TODO: We need to parse the level data for building a full level. This data is complex and relies on complex TypeScript types. Find a way to easily share these between repos.
});
