import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  profileImage: {
    type: String,
    default: "",
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    default: "",
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
    default: "",
  },
  phoneNumber: {
    type: String,
    default: "",
  },
  dob: {
    type: Date,
    default: null,
  },
  location: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  interest: {
    type: [String],
    default: [],
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

export const UserProfile =
  mongoose.models?.UserProfile ||
  mongoose.model("UserProfile", userProfileSchema);
