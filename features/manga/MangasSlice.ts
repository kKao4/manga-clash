import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";

export const initialMangasState: {
  page: number;
} = {
  page: 0,
};

export const mangasSlice = createSlice({
  name: "mangas",
  initialState: initialMangasState,
  reducers: {
    setPageMangas: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
});

export const { setPageMangas } = mangasSlice.actions;

export const selectMangasState = (state: RootState) => state.mangas;

export default mangasSlice.reducer;
