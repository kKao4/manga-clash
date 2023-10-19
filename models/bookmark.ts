import mongoose, { Schema } from "mongoose";

const BookmarkSchema = new mongoose.Schema({
  mangaId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  mangaHref: {
    type: String,
    required: true,
    unique: true,
  },
  bookmarks: {
    type: [Schema.Types.ObjectId],
    required: true,
    default: [],
  },
});

export type BookmarkType = mongoose.InferSchemaType<typeof BookmarkSchema>;

export default mongoose.models.bookmarks ||
  mongoose.model("bookmarks", BookmarkSchema);
