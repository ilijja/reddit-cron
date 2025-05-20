import { model, Model, models, Schema } from "mongoose";
import { AvgStats } from "../utils/types";

const avgStatsSchema = new Schema<AvgStats>(
  {
    name: { type: String, required: true },
    timestamp: { type: Date, required: true },
    sum: { type: Number, required: true },
    n: { type: Number, required: true },
    avg: { type: Number, required: true },
  },
  { versionKey: false }
);

const AvgStatsModel: Model<AvgStats> =
  models.AvgStats || model("AvgStats", avgStatsSchema);

export default AvgStatsModel;
