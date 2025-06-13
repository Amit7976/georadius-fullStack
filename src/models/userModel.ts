import mongoose from "mongoose";


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  password: {
    type: String,
    select: false,
    default: "",
  },
  tempPassword: {
    type: String,
    select: false,
    default: "",
  },
  googleId: {
    type: String,
  },
});

/////////////////////////////////////////////////////////////////////////////////////////////////////

export const User = mongoose.models?.User || mongoose.model("User", userSchema);
