import mongoose, { Schema } from "mongoose";

mongoose.set('strictQuery', true);

const nestedViewSchema = new mongoose.Schema(
  {
    num: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const viewSchema = new mongoose.Schema({
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
  views: {
    type: [nestedViewSchema],
    default: [],
  },
});

export type ViewType = mongoose.InferSchemaType<typeof viewSchema>;

export default mongoose.models.views || mongoose.model("views", viewSchema);
