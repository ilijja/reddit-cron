import mongoose, { mongo } from "mongoose";

export interface Stats extends Document {
  _id: string;
  subreddit_name: string;
  count: number;
  timestamp: Date;
}

export interface Rule {
  name: string;
  description: string;
}

export interface Subreddit {
  _id: string;
  name: string;
  group: number;
  icon: string;
  users: string[];
  description: string;
  members: number;
  flairs: Flair[];
  rules: Rule[];
}

export interface Flair {
  flairId: string;
  name: string;
}

export enum PostStatus {
  SCHEDULED = "scheduled",
  FAILED = "failed",
  POSTED = "posted",
  PROCESSING = "processing",
  CANCELED = "canceled",
}

export interface IPost extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: "Text" | "Video" | "Image" | "Link";
  title: string;
  content: string;
  flairId: string;
  kind: "self" | "image" | "video" | "link";
  sub: string;
  subIcon?: string;
  nsfw: boolean;
  status: PostStatus;
  url?: string;
  time: Date;
  redditPostId: string;
  comment: string;
}

export interface AvgStats extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  day: string;
  time: string;
  sum: number;
  n: number;
  avg: number;
}
