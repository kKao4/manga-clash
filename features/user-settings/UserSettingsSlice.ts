import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";

export const initialUserSettingsState: {
  menu: "bookmarks" | "account" | "addManga" | "chart";
} = {
  menu: "account",
};

export const userSettingsSlice = createSlice({
  name: "user-settings",
  initialState: initialUserSettingsState,
  reducers: {
    setMenu: (
      state,
      action: PayloadAction<(typeof initialUserSettingsState)["menu"]>
    ) => {
      state.menu = action.payload;
    },
  },
});

export const { setMenu } = userSettingsSlice.actions;

export const selectUserSettingsState = (state: RootState) => state.userSettings;

export default userSettingsSlice.reducer;
