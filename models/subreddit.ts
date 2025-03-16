import { Model, model, models, Schema } from "mongoose";
import FlairSchema from "../models/flair";
import RuleSchema from "../models/rule";
import { Subreddit } from "../utils/types";

const subredditSchema = new Schema<Subreddit>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    group: {
      type: Number,
      required: true,
    },
    icon: {
      type: String,
      required: false,
    },
    description: {
      type: String,
    },
    members: {
      type: Number,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    flairs: [FlairSchema],
    rules: [RuleSchema],
  },
  { timestamps: true }
);

const SubredditModel: Model<Subreddit> = models.Subreddit || model<Subreddit>("Subreddit", subredditSchema);

export default SubredditModel;
