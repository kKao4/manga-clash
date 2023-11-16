import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";

export const initialRatingState: {
  href: string;
  star: number;
}[] = [];
export const RatingSlice = createSlice({
  name: "rating",
  initialState: initialRatingState,
  reducers: {
    setUserRating: (
      state,
      action: PayloadAction<(typeof initialRatingState)[number]>
    ) => {
      const { href, star } = action.payload;
      let exist = false;
      state.map((rating) => {
        if (rating.href === href) {
          exist = true;
          rating.star = star;
        }
      });
      if (!exist) {
        state.push({ href, star });
      }
    },
  },
});

export const { setUserRating } = RatingSlice.actions;

export const selectUserRating = (state: RootState, href: string) =>
  state.rating.find((manga) => manga.href === href);

export default RatingSlice.reducer;
