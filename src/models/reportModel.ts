import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  photos: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);
