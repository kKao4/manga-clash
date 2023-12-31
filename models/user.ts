import { emailReg, usernameReg } from "@/type";
import mongoose, { Schema } from "mongoose";

mongoose.set("strictQuery", true);

const historySchema = new mongoose.Schema(
  {
    mangaId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    chapter: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minLength: 4,
    maxLength: 50,
    match: usernameReg,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: emailReg,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
    required: true,
  },
  bookmarks: {
    type: [Schema.Types.ObjectId],
    default: [],
    required: true,
  },
  profilePicture: {
    type: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },
    default: { url: "", publicId: "" },
  },
  history: {
    type: [historySchema],
    default: [],
    required: true,
  },
});

export type UserSchemaType = mongoose.InferSchemaType<typeof userSchema>;
export type UserType = UserSchemaType & { _id: string };

export default mongoose.models.users || mongoose.model("users", userSchema);
