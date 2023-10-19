import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { MangaType } from "@/models/manga";

export const initialMangaState: Omit<MangaType, "chapters">[] = [];

export const mangaSlice = createSlice({
  name: "manga",
  initialState: initialMangaState,
  reducers: {
    addOrUpdateManga: (
      state,
      action: PayloadAction<(typeof initialMangaState)[number]>
    ) => {
      const {
        _id,
        name,
        otherName,
        href,
        author,
        description,
        tags,
        image,
        rating,
        bookmarks,
        views,
        completed,
        createdAt,
        updatedAt,
      } = action.payload;
      const exist = state.some((manga) => {
        if (manga._id === _id) {
          Object.assign(manga, {
            _id,
            name,
            otherName,
            href,
            author,
            description,
            tags,
            image,
            rating,
            bookmarks,
            views,
            completed,
            createdAt,
            updatedAt,
          });
          return true;
        }
      });
      if (!exist) {
        state.push({
          _id: _id,
          name: name,
          otherName: otherName,
          href: href,
          author: author,
          description: description,
          tags: tags,
          image: image,
          rating: rating,
          bookmarks: bookmarks,
          views: views,
          completed: completed,
          createdAt: createdAt,
          updatedAt: updatedAt,
        });
      }
    },
  },
});

export const { addOrUpdateManga } = mangaSlice.actions;

export const selectMangaState = (state: RootState, _id: string | undefined) =>
  state.manga.find((manga) => manga._id === _id);

export default mangaSlice.reducer;
