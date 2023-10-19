import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";

export const initialRatingState: {
  star: number;
} = {
  star: 0,
};

export const RatingSlice = createSlice({
  name: "rating",
  initialState: initialRatingState,
  reducers: {
    setUserRating: (
      state,
      action: PayloadAction<(typeof initialRatingState)["star"]>
    ) => {
      state.star = action.payload;
    },
  },
});

export const { setUserRating } = RatingSlice.actions;

export const selectUserRating = (state: RootState) => state.rating;

export default RatingSlice.reducer;
