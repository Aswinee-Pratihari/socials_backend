import mongoose from "mongoose";
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      maxlength: 500,
    },
    img: { type: String },
    likes: [],
    bookmark: [],
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
