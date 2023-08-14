import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, maxlength: 500 },
    followers: [],
    following: [],
    profilePicture: String,
    coverPicture: String,
    createdAt: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
