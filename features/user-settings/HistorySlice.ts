import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { MangaType } from "@/models/manga";

export const initialHistoryState: {
  mangas: {
    manga: MangaType;
    chapter: string;
    createdAt: string;
  }[];
  length: number;
  name: string;
  page: number;
} = {
  mangas: [],
  length: 0,
  name: "",
  page: 1,
};

export const historySlice = createSlice({
  name: "history",
  initialState: initialHistoryState,
  reducers: {
    setMangasHistory: (
      state,
      action: PayloadAction<
        Pick<typeof initialHistoryState, "mangas" | "length">
      >
    ) => {
      const { mangas, length } = action.payload;
      state.mangas = mangas as any;
      state.length = length;
    },
    setSearchNameHistory: (
      state,
      action: PayloadAction<(typeof initialHistoryState)["name"]>
    ) => {
      state.name = action.payload;
    },
    setPageHistory: (
      state,
      action: PayloadAction<(typeof initialHistoryState)["page"]>
    ) => {
      state.page = action.payload;
    },
  },
});

export const { setMangasHistory, setSearchNameHistory, setPageHistory } =
  historySlice.actions;

export const selectHistoryState = (state: RootState) => state.history;

export default historySlice.reducer;
