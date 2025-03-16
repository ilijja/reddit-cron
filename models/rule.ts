import { Schema } from "mongoose";

const RuleSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
});

export default RuleSchema;
