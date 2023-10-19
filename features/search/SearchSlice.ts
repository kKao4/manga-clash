import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";

export const initialSearchState: {
  name: string;
  author: string;
  tags: string[];
  completed: "false" | "true" | "";
  page: number;
} = {
  name: "",
  author: "",
  tags: [],
  completed: "",
  page: 1,
};

export const searchSlice = createSlice({
  name: "search",
  initialState: initialSearchState,
  reducers: {
    setSearchName: (
      state,
      action: PayloadAction<(typeof initialSearchState)["name"]>
    ) => {
      state.name = action.payload;
    },
    setSearchAuthor: (
      state,
      action: PayloadAction<(typeof initialSearchState)["author"]>
    ) => {
      state.author = action.payload;
    },
    setSearchCompleted: (
      state,
      action: PayloadAction<(typeof initialSearchState)["completed"]>
    ) => {
      state.completed = action.payload;
    },
    addSearchTags: (state, action: PayloadAction<string>) => {
      if (!state.tags.includes(action.payload)) {
        state.tags.push(action.payload);
      }
    },
    resetSearchTags: (state) => {
      state.tags = [];
    },
    addOrDeleteSearchTags: (state, action: PayloadAction<string>) => {
      if (state.tags.includes(action.payload)) {
        state.tags = state.tags.filter((tag) => tag !== action.payload);
      } else {
        state.tags.push(action.payload);
      }
    },
    resetSearch: (state) => {
      Object.assign(state, {
        name: "",
        author: "",
        tags: [],
        completed: "",
      });
    },
    setPageSearch: (
      state,
      action: PayloadAction<(typeof initialSearchState)["page"]>
    ) => {
      state.page = action.payload;
    },
  },
});

export const {
  setSearchName,
  setSearchAuthor,
  setSearchCompleted,
  addSearchTags,
  resetSearchTags,
  addOrDeleteSearchTags,
  resetSearch,
  setPageSearch,
} = searchSlice.actions;

export const selectSearchState = (state: RootState) => state.search;

export default searchSlice.reducer;
