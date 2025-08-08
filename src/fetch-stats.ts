import mongoose from "mongoose";
import { connectDB } from "../lib/mongodb";
import StatsModel from "../models/stats";
import SubredditModel from "../models/subreddit";
import AvgStatsModel from "../models/avg_stats";
import { getAppAccessToken } from "../utils/reddit";
import dotenv from "dotenv";
import { fetchSubredditData } from "../utils/utils";
import getValidatedCount from "../utils/useValidate";
dotenv.config();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  try {
    await connectDB();
    const accessToken = await getAppAccessToken();

    console.log(accessToken)

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
        console.log(count)

        const validatedCount = await getValidatedCount(sub.name, count);

        results.push({
          subreddit_name: sub.name,
          count: validatedCount,
          timestamp: batchTimestamp,
        });

        await AvgStatsModel.findOneAndUpdate(
          { name: sub.name, timestamp: batchTimestamp },
          [
            {
              $set: {
                sum: {
                  $add: [
                    { $ifNull: ["$sum", 0] },
                    { $literal: validatedCount },
                  ],
                },
                n: {
                  $add: [
                    { $ifNull: ["$n", 0] },
                    { $literal: validatedCount > 0 ? 1 : 0 },
                  ],
                },
              },
            },
            {
              $set: {
                avg: {
                  $cond: [{ $gt: ["$n", 0] }, { $divide: ["$sum", "$n"] }, 0],
                },
              },
            },
          ],
          { upsert: true, new: true }
        );

        if (i < subreddits.length - 1) {
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
