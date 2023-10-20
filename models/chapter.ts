import mongoose, { Schema } from "mongoose";

mongoose.set('strictQuery', true);

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
      type: [
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
            type: [String],
            default: [],
          },
          updatedAt: {
            type: String,
            required: true,
            default: new Date().toISOString(),
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export type ChapterType = mongoose.InferSchemaType<typeof ChapterSchema>;

export default mongoose.models.chapters ||
  mongoose.model("chapters", ChapterSchema);
