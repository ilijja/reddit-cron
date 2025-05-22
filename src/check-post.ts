import axios from "axios";
import { connectDB } from "../lib/mongodb";
import PostModel from "../models/posts";
import mongoose from "mongoose";

async function main() {
  try {
    await connectDB();

    const now = new Date();
    const nextMinute = new Date(now);
    nextMinute.setMinutes(now.getMinutes() + 5);

    const posts = await PostModel.find({
      $and: [{ time: { $lt: nextMinute } }, { status: "scheduled" }],
    });

    if (!posts || posts.length === 0) {
      console.log("No posts found at this time.");
      return;
    }

    await PostModel.updateMany(
      { _id: { $in: posts.map((post) => post._id) } },
      { $set: { status: "scheduled" } }
    );

    for (const post of posts) {
      const response = await axios.post(process.env.PUBLISH_API_ROUTE!, post, {
        headers: { "x-app-access-token": process.env.APP_ACCESS_TOKEN },
      });
      console.log(response.data);
    }

    console.log("All posts processed successfully.");
  } catch (error) {
    console.error("Error in main function:", error);
  } finally {
    await mongoose.disconnect();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Unhandled error:", error);
    process.exit(1);
  });
