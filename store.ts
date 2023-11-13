import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./features/GlobalSlice";
import userReducer from "./features/UserSlice";
import bookmarkReducer from "./features/user-settings/BookmarkSlice";
import ratingReducer from "./features/mangaHref/UserRatingSlice";
import mangaReducer from "./features/mangaHref/MangaSlice";
import searchReducer from "./features/search/SearchSlice";
import chartReducer from "./features/user-settings/ChartSlice";
import userSettingsReducer from "./features/user-settings/UserSettingsSlice";
import mangasReducer from "./features/manga/MangasSlice";
import historyReducer from "./features/user-settings/HistorySlice";

const store = configureStore({
  reducer: {
    global: globalReducer,
    user: userReducer,
    bookmark: bookmarkReducer,
    rating: ratingReducer,
    manga: mangaReducer,
    search: searchReducer,
    chart: chartReducer,
    userSettings: userSettingsReducer,
    mangas: mangasReducer,
    history: historyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
