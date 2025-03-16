import { Flair } from "../utils/types";
import { Schema } from "mongoose";

const FlairSchema = new Schema<Flair>({
  flairId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: false,
  },
});

export default FlairSchema;
