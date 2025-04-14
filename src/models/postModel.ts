import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    categories: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    creatorName: {
      type: String,
      required: true,
      trim: true,
    },
    creatorImage: {
      type: String,
      required: true,
      trim: true,
    },
    upvote: {
      type: [String],
      default: [],
    },
    downvote: {
      type: [String],
      default: [],
    },
    report: {
      type: [String],
      default: [],
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    share: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.models?.Post || mongoose.model("Post", PostSchema);
