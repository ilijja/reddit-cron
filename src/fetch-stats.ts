import mongoose from "mongoose";
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
    console.log("error in fetch_sub_data:", error);

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

      await StatsModel.insertMany(results);
    }
    console.log("finished all");
  } catch (error) {
    console.error("Cron error from main:", error);
  } finally {
    try {
      await mongoose.disconnect();
      console.log("MongoDB konekcija uspešno zatvorena.");
    } catch (error) {
      console.error("Greška pri zatvaranju MongoDB konekcije:", error);
    }
  }
}

main()
  .then(() => {
    console.log("Sve završeno, gasim proces.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Neuhvaćena greška:", error);
    process.exit(1);
  });
