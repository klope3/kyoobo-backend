import "dotenv/config";

export const url = process.env.SERVER_URL;
if (!url) throw new Error("No server url!");

export const requestOptionsGet = {
  method: "GET",
};

export async function fetchUser(id: number) {
  const requestOptions = {
    method: "GET",
  };

  return fetch(`${url}/users/${id}`, requestOptions);
}
