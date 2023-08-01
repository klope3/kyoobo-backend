import "dotenv/config";

export const url = process.env.SERVER_URL;
if (!url) throw new Error("No server url!");

export const requestOptionsGet = {
  method: "GET",
};

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

export async function getLevelsResponse() {
  return fetch(`${url}/levels`, requestOptionsGet);
}

export function getRatingResponse(
  userId: number,
  levelId: number,
  token: string
) {
  const headers = new Headers();
  headers.append("Authorization", "Bearer " + token);
  const requestOptions = {
    method: "GET",
    headers,
  };
  return fetch(`${url}/users/${userId}/ratings/${levelId}`, requestOptions);
}
