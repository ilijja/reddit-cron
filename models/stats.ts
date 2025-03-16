import { Model, model, models, Schema } from "mongoose";
import { Stats } from "../utils/types";

const statsSchema = new Schema<Stats>(
  {
    subreddit_name: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const StatsModel: Model<Stats> = models.Stats || model("Stats", statsSchema);

export default StatsModel;
