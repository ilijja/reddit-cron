import axios from "axios";

const getURL = (subredditName: string) =>
  `https://oauth.reddit.com/r/${subredditName}/about.json`;

export async function fetchSubredditData(subredditName: string, accessToken: string) {
  try {
    const response = await axios.get(getURL(subredditName), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": process.env.REQUEST_USER_AGENT,
        "Content-Type": "application/json",
      },
    });
    const result = response.data;

    return result.data.active_user_count || 0;
  } catch (error) {
    console.log("error in fetch_sub_data:", error);

    return 0;
  }
}
