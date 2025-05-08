import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userid: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    phoneNumber: String,
    bizNum: String,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
