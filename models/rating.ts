import mongoose, { Schema } from "mongoose";

mongoose.set('strictQuery', true);

const RatingSchema = new mongoose.Schema({
  stars: {
    type: [
      {
        star: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        userId: {
          type: Schema.Types.ObjectId,
          required: true,
        },
      },
    ],
    default: [],
  },
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
});

export type RatingType = mongoose.InferSchemaType<typeof RatingSchema>;

export default mongoose.models.ratings ||
  mongoose.model("ratings", RatingSchema);
