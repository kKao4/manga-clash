import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { MangaType } from "@/models/manga";

export const initialMangaBookmark: {
  mangas: MangaType[];
  length: number;
  name: string;
  page: number;
} = {
  mangas: [],
  length: 0,
  name: "",
  page: 1,
};

export const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState: initialMangaBookmark,
  reducers: {
    setMangasBookmark: (
      state,
      action: PayloadAction<
        Pick<typeof initialMangaBookmark, "mangas" | "length">
      >
    ) => {
      const { mangas, length } = action.payload;
      state.mangas = mangas as any;
      state.length = length;
    },
    setSearchName: (
      state,
      action: PayloadAction<(typeof initialMangaBookmark)["name"]>
    ) => {
      state.name = action.payload;
    },
    setPageBookmark: (
      state,
      action: PayloadAction<(typeof initialMangaBookmark)["page"]>
    ) => {
      state.page = action.payload;
    },
  },
});

export const { setMangasBookmark, setSearchName, setPageBookmark } =
  bookmarkSlice.actions;

export const selectBookmarkState = (state: RootState) => state.bookmark;

export default bookmarkSlice.reducer;
