import axios from "axios";

export async function getAppAccessToken() {
  console.log(process.env.ACCESS_TOKEN_URL);

  try {
    const response = await axios.post(
      process.env.ACCESS_TOKEN_URL!,
      new URLSearchParams({
        grant_type: "client_credentials",
      }),
      {
        auth: {
          username: process.env.REDDIT_CLIENT_ID!,
          password: process.env.REDDIT_CLIENT_SECRET!,
        },
        headers: {
          "User-Agent": process.env.REQUEST_USER_AGENT,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw new Error("Unable to fetch access token");
  }
}
