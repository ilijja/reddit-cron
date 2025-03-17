import { connectDB } from "../lib/mongodb";
import StatsModel from "../models/stats";
import SubredditModel from "../models/subreddit";
import { getAppAccessToken } from "../utils/reddit";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getURL = (subredditName: string) =>
  `https://oauth.reddit.com/r/${subredditName}/about.json`;

async function fetchSubredditData(subredditName: string, accessToken: string) {
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
    console.log("error in fetch_sub_data");

    return 0;
  }
}

async function main() {
  try {
    await connectDB();
    const accessToken = await getAppAccessToken();

    const now = new Date();
    const batchTimestamp = new Date(
      now.setMinutes(Math.floor(now.getMinutes() / 10) * 10, 0, 0)
    );

    const totalGroups = await SubredditModel.distinct("group");

    for (const group of totalGroups) {
      const subreddits = await SubredditModel.find({ group });

      const results = [];

      for (let i = 0; i < subreddits.length; i++) {
        const sub = subreddits[i];
        const count = await fetchSubredditData(sub.name, accessToken);

        results.push({
          subreddit_name: sub.name,
          count,
          timestamp: batchTimestamp,
        });

        console.log("sub: ", sub.name, "Count: ", count);

        if (i < subreddits.length - 1) {
          console.log(`Pauza 1100ms pre sledećeg subreddita...`);
          await sleep(1100);
        }
      }

      console.log("adding to db");
      await connectDB();
      await StatsModel.insertMany(results);
      console.log("finishing");
    }
    console.log("finished all");
  } catch (error) {
    console.error("Cron error:");
  }
}

main().catch(console.error);
