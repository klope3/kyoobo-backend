import jwtDecode from "jwt-decode";
import { testUsers } from "../../seedData";
// import { getLevelsResponse, loginResponse } from "../testUtils";
import { parseTokenJson } from "../testValidations";
import { parseObjWithId } from "../../validations";

// const testUserData = {
//   authToken: "",
//   userId: 0,
//   userData: testUsers[0],
//   initialized: false,
// };

// const testLevelData = {
//   levelId: 0,
//   initialized: false,
// };

// export async function getTestUserData() {
//   if (testUserData.initialized) return testUserData;

//   const { userData } = testUserData;
//   const response = await loginResponse(userData.email, userData.password);
//   if (!response.ok) {
//     throw new Error(
//       `The fetch request for getting a token failed: ${response.statusText}`
//     );
//   }
//   const json = await response.json();
//   const parsedTokenJson = parseTokenJson(json);
//   testUserData.authToken = parsedTokenJson.token;

//   const decoded = jwtDecode(testUserData.authToken);
//   const parsedDecoded = parseObjWithId(decoded);
//   testUserData.userId = parsedDecoded.id;
//   testUserData.initialized = true;
//   return testUserData;
// }

// export async function getTestLevelData() {
//   if (testLevelData.initialized) return testLevelData;

//   const response = await getLevelsResponse();
//   const json = await response.json();
//   if (json.length === 0) throw new Error("There were no levels in the db!");
//   testLevelData.levelId = json[0].id;
//   testLevelData.initialized = true;
//   return testLevelData;
// }
