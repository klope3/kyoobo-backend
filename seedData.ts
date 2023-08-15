import {User, Level, LevelCharacter, LevelPickup, LevelTile} from "@prisma/client"
import { hashPassword } from "./authUtils";

export const testUsers: (Omit<User, "id" | "passwordHash"> & {password: string})[] = [
  {
    email: "bob.jones@site.com",
    // passwordHash: hashPassword("lollipop"),
    password: "lollipop",
    joinDate: new Date(1687388726395),
    username: "bobbo"
  },
  {
    email: "sally.jones@web.com",
    // passwordHash: hashPassword("catsRock"),
    password: "catsRock",
    joinDate: new Date(1685388726395),
    username: "sallyRocks"
  },
  {
    email: "john.doe@gmail.com",
    // passwordHash: hashPassword("password1234"),
    password: "password1234",
    joinDate: new Date(1685488726395),
    username: "hashtag_john"
  }
]

const levelDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra orci id interdum tempus. Ut commodo vitae mi et rutrum. Donec vel egestas erat, vitae faucibus libero. Phasellus rutrum est vitae urna rutrum, vitae suscipit quam blandit. Mauris sit amet sagittis augue. Sed gravida semper erat et accumsan. Mauris vestibulum, orci et dictum condimentum, est eros dapibus leo, at pulvinar orci massa id metus. Vestibulum pulvinar enim vel est convallis sollicitudin. Donec viverra lacinia cursus. Donec et nisl ac augue tristique laoreet vitae et neque.";

const solidDigit = 1, playerDigit = 2, enemyDigit = 3, pickupDigit = 4, goalDigit = 5;

const testMap1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,5],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
  [2,0,0,0,0,1,0,1,0,1,0,1,0,3,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
  [0,4,4,4,4,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,4,4,4,4,4,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];
const testMap2 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,2,0],
  [0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1],
  [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,3,0,1,0,3,0,1,0,0,3,0,0],
  [0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,0,0,0,0,0,0,0,0,5,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];
const testMap3 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,5,0,0],
  [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
  [0,2,0,0,0,0,1,0,3,0,1,0,3,0,1,0,3,0,1,0,3,0,0,0,1,4,4,4,4,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const testMap1Interpreted = interpretRawMap(testMap1);
const testMap2Interpreted = interpretRawMap(testMap2);
const testMap3Interpreted = interpretRawMap(testMap3);

type OtherLevelDataBase = {
  positionX: number;
  positionY: number;
  type: string;
}//characters, tiles, and pickups share these fields
type OtherLevelData = {
  tiles: OtherLevelDataBase[];
  characters: OtherLevelDataBase[];
  pickups: OtherLevelDataBase[];
}
export const testLevels: (Omit<Level, "id" | "userId"> & OtherLevelData)[] = [
  {
    title: "My Cool Level",
    description: levelDescription,
    goalPositionX: testMap1Interpreted.goalPositionX,
    goalPositionY: testMap1Interpreted.goalPositionY,
    playerPositionX: testMap1Interpreted.playerPositionX,
    playerPositionY: testMap1Interpreted.playerPositionY,
    private: false,
    dateCreated: new Date(1689173945207),
    dateUpdated: new Date(1689183945207),
    characters: testMap1Interpreted.characters,
    pickups: testMap1Interpreted.pickups,
    tiles: testMap1Interpreted.tiles
  },
  {
    title: "My Rad Level",
    description: levelDescription,
    goalPositionX: testMap2Interpreted.goalPositionX,
    goalPositionY: testMap2Interpreted.goalPositionY,
    playerPositionX: testMap2Interpreted.playerPositionX,
    playerPositionY: testMap2Interpreted.playerPositionY,
    private: false,
    dateCreated: new Date(1688173945207),
    dateUpdated: new Date(1688373945207),
    characters: testMap2Interpreted.characters,
    pickups: testMap2Interpreted.pickups,
    tiles: testMap2Interpreted.tiles
  },
  {
    title: "My First Level",
    description: levelDescription,
    goalPositionX: testMap3Interpreted.goalPositionX,
    goalPositionY: testMap3Interpreted.goalPositionY,
    playerPositionX: testMap3Interpreted.playerPositionX,
    playerPositionY: testMap3Interpreted.playerPositionY,
    private: true,
    dateCreated: new Date(1689073945207),
    dateUpdated: new Date(1689273945207),
    characters: testMap3Interpreted.characters,
    pickups: testMap3Interpreted.pickups,
    tiles: testMap3Interpreted.tiles
  }
];

function interpretRawMap(map: number[][]) {
  let goalPositionX = 0;
  let goalPositionY = 0;
  let playerPositionX = 0;
  let playerPositionY = 0;
  const tiles: OtherLevelDataBase[] = [];
  const characters: OtherLevelDataBase[] = [];
  const pickups: OtherLevelDataBase[] = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const val = map[y][x];
      if (val === playerDigit) {
        playerPositionX = x;
        playerPositionY = y;
      }
      if (val === enemyDigit) {
        characters.push({positionX: x, positionY: y, type: "enemy"});
      }
      if (val === pickupDigit) {
        pickups.push({positionX: x, positionY: y, type: "default"});
      }
      if (val === solidDigit) {
        tiles.push({positionX: x, positionY: y, type: "brick_green"})
      }
      if (val === goalDigit) {
        goalPositionX = x;
        goalPositionY = y;
      }
    }
  }
  return {
    goalPositionX,
    goalPositionY,
    playerPositionX,
    playerPositionY,
    tiles,
    characters,
    pickups
  };
}