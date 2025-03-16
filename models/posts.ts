import { Model, model, models, Schema } from "mongoose";
import { IPost, PostStatus } from "../utils/types";

const postSchema = new Schema<IPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["Text", "Video", "Image", "Link"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    flairId: {
      type: String,
    },
    kind: {
      type: String,
      enum: ["self", "image", "video", "link"],
      required: true,
    },
    sub: {
      type: String,
      required: true,
    },
    subIcon: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: PostStatus,
      default: PostStatus.SCHEDULED,
    },
    url: {
      type: String,
      required: false,
    },
    redditPostId: {
      type: String,
      default: null,
    },
    time: {
      type: Date,
      required: true,
    },
    comment: {
      type: String,
      required: false,
    },
    nsfw: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const PostModel: Model<IPost> = models.Post || model<IPost>("Post", postSchema);

export default PostModel;
