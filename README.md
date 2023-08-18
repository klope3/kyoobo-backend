# Kyoobo Backend API

This is the backend API for the game Kyoobo. Looking for the front end repo? You can find it [here](https://github.com/klope3/platformer-creator-game).

## Purpose

The purpose of this API is to allow the game client to interact with the database. It performs CRUD operations and also handles authentication and authorization.

## Technologies

Express is used for handling requests. Prisma is used for interacting with the database. JWT is used for authentication. Zod is used for parsing and validating data during tests.

## Endpoints

### POST /login

- Description: Log in with your credentials.
- Request body:

```
{
  "email": "john.doe@site.com",
  "password": "password1234"
}
```

- Response Format:

```
{
  "token": "your_JWT_token",
  "username": "johnDoe",
  "email": "john.doe@site.com"
}
```

### POST /users

- Description: Create a new user account.
- Request body:

```
{
  "username": "johnDoe",
  "email": "john.doe@site.com",
  "password": "password1234"
}
```

- Response format:

```
{
  "token": "your_JWT_token",
  "username": "johnDoe",
  "email": "john.doe@site.com"
}
```

### GET /users/{userId}

- Description: Get non-sensitive information on a specific user.
- Parameters:
  - userId (int): The database ID of the user.
- Response format:

```
{
  "id": 1234,
  "email": "john.doe@site.com",
  "username": "johnDoe",
  "joinDate": "2023-06-21T23:05:26.395Z"
}
```

### GET /users/{userId}/ratings/{levelId}

- Description: Get a specific user's rating for a specific level[^1].
- Parameters:
  - userId (int): The database ID of the user.
  - levelId (int): The database ID of the level.
- Response format:

```
{
  "id": 1234,
  "userId": 1234,
  "levelId": 1234,
  "value": 7
}
```

### DELETE /users/{userId}/ratings/{levelId}

- Description: Delete a specific user's rating for a specific level[^1].
- Parameters:
  - userId (int): The database ID of the user.
  - levelId (int): The database ID of the level.
- Response format:

```
{
  "id": 1234,
  "userId": 1234,
  "levelId": 1234,
  "value": 7
}
```

### PUT /users/{userId}/ratings/{levelId}

- Description: Update a specific user's rating for a specific level[^1].
- Parameters:
  - userId (int): The database ID of the user.
  - levelId (int): The database ID of the level.
- Request body:

```
{
  "value": 7
}
```

- Response format:

```
{
  "id": 1234,
  "userId": 1234,
  "levelId": 1234,
  "value": 7
}
```

- Note: The value must be between 0 and 10 (inclusive).

### POST /ratings

- Description: Create a new rating for a specific user and specific level.
- Request body:

```
{
  "userId": 1234,
  "levelId": 1234,
  "value": 7
}
```

- Response format:

```
{
  "id": 1234,
  "userId": 1234,
  "levelId": 1234,
  "value": 7
}
```

### GET /levels/

- Description: Get an array of all levels in the database[^2]. Each level object also includes some extra properties (such as "averageRating" and "totalRatings") that are derived from other data associated with the level.
- Response format:

```
{
  "averageRating": 2.75,
  "totalRatings": 10,
  "totalCompletions": 10,
  "id": 1234,
  "title": "John Doe's Level",
  "description": "This is the description for John Doe's level.",
  "private": false,
  "dateCreated": "2023-07-12T14:59:05.207Z",
  "dateUpdated": "2023-07-12T17:45:45.207Z",
  "goalPositionX": 0,
  "goalPositionY": 0,
  "playerPositionX": 0,
  "playerPositionY": 0,
  "userId": 1234,
  "user": {
    "username": "johnDoe"
  }
}
```

### GET /levels/{levelId}

- Description: Get all data needed for the Phaser client to prepare the level for play.
- Response format:

```
{
  "averageRating": 2.75,
  "totalRatings": 10,
  "totalCompletions": 10,
  "id": 1234,
  "title": "John Doe's Level",
  "description": "This is the description for John Doe's level.",
  "private": false,
  "dateCreated": "2023-07-12T14:59:05.207Z",
  "dateUpdated": "2023-07-12T17:45:45.207Z",
  "goalPositionX": 0,
  "goalPositionY": 0,
  "playerPositionX": 0,
  "playerPositionY": 0,
  "userId": 1234,
  "user": {
    "username": "johnDoe"
  },
  "characters": [
    {
      "id": 1234,
      "positionX": 0,
      "positionY": 0,
      "type": "enemy",
      "levelId": 1234
    }
  ],
  "tiles": [
    {
      "id": 1234,
      "positionX": 0,
      "positionY": 0,
      "type": "brick",
      "levelId": 1234
    }
  ],
  "pickups": [
    {
      "id": 1234,
      "positionX": 0,
      "positionY": 0,
      "type": "pickup",
      "levelId": 1234
    }
  ]
}
```

### GET /levels/{levelId}/completions

- Description: Get all completions for a specific level[^2].
- Parameters:
  - levelId (int): The database ID of the level.
- Response format:

```
{
  "id": 1234,
  "userId": 1234,
  "levelId": 1234,
  "dateCompleted": "2023-07-13T07:14:05.645Z",
  "gameDuration": 12345,
  "lives": 2,
  "score": 400,
  "user": {
    "id": 1234,
    "username": "johnDoe"
  }
}
```

Note: The value of "gameDuration" is in milliseconds.

### POST /levels/completions

- Description: Create a new completion for a specific level.
- Request body:

```
{
  "userId": 1234,
  "levelId": 1234,
  "completionTime": 12345,
  "lives": 3,
  "score": 400
}
```

- Response format:

```
{
  "id": 1234,
  "userId": 1234,
  "levelId": 1234,
  "dateCompleted": "2023-07-13T07:14:05.645Z",
  "gameDuration": 12345,
  "lives": 2,
  "score": 400,
  "user": {
    "id": 1234,
    "username": "johnDoe"
  }
}
```

---

[^1]: The value of "value" will always be an integer, because that's how the ratings are stored in the database. The client will divide this by 2 to get a rating out of 5 (e.g. 3.5/5).
[^2]: This endpoint will change in the near future as the number of created levels grows, and retrieving all entries in the database becomes impractical.
