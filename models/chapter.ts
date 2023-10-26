import mongoose, { Schema } from "mongoose";

mongoose.set("strictQuery", true);

const NestedChapterSchema = new mongoose.Schema(
  {
    num: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    imagesPath: {
      type: [
        {
          url: {
            type: String,
            default: "",
          },
          publicId: {
            type: String,
            default: "",
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const ChapterSchema = new mongoose.Schema(
  {
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
    chapters: {
      type: [NestedChapterSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export type ChapterType = mongoose.InferSchemaType<typeof ChapterSchema>;

export default mongoose.models.chapters ||
  mongoose.model("chapters", ChapterSchema);
