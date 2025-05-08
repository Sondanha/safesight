import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userid: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", postSchema);
