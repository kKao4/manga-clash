import mongoose, { Schema } from "mongoose";

mongoose.set("strictQuery", true);

const chapterSchema = new mongoose.Schema(
  {
    num: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

const MangaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    href: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    otherName: {
      type: String,
      trim: true,
      default: "",
    },
    // translateTeam: {
    //   type: String,
    //   trim: true,
    // },
    author: {
      type: String,
      default: "",
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      required: true,
    },
    image: {
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
    rating: {
      type: {
        star: {
          type: Number,
          min: 0,
          max: 5,
          required: true,
        },
        length: {
          type: Number,
          min: 0,
          required: true,
        },
      },
      default: { star: 0, length: 0 },
      required: true,
    },
    bookmarks: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    views: {
      type: {
        value: {
          type: Number,
          default: 0,
          min: 0,
        },
        rank: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
      default: {
        value: 0,
        rank: 0,
      },
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    chapters: {
      type: [chapterSchema],
      default: [],
      required: true,
    },
  },
  { timestamps: true }
);

type MangaSchemaType = mongoose.InferSchemaType<typeof MangaSchema>;
export type MangaType = MangaSchemaType & { _id: string };

export default mongoose.models.mangas || mongoose.model("mangas", MangaSchema);
