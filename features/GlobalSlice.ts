import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";

export const initialGlobalState: {
  sort: "latest" | "a-z" | "rating" | "views" | "new";
  showSignUp: boolean;
  showSignIn: boolean;
  showResetPassword: boolean;
  adminMode: boolean;
  darkMode: boolean;
} = {
  sort: "latest",
  showSignUp: false,
  showSignIn: false,
  showResetPassword: false,
  adminMode: false,
  darkMode: true,
};

export type Order = (typeof initialGlobalState)["sort"];

export const globalSlice = createSlice({
  name: "global",
  initialState: initialGlobalState,
  reducers: {
    setSort: (
      state,
      action: PayloadAction<(typeof initialGlobalState)["sort"]>
    ) => {
      state.sort = action.payload;
    },
    toggleSignUp: (
      state,
      action: PayloadAction<(typeof initialGlobalState)["showSignUp"]>
    ) => {
      state.showSignUp = action.payload;
    },
    toggleSignIn: (
      state,
      action: PayloadAction<(typeof initialGlobalState)["showSignIn"]>
    ) => {
      state.showSignIn = action.payload;
    },
    toggleResetPassword: (
      state,
      action: PayloadAction<(typeof initialGlobalState)["showResetPassword"]>
    ) => {
      state.showResetPassword = action.payload;
    },
    toggleAdminMode: (state) => {
      state.adminMode = state.adminMode ? false : true;
    },
    toggleDarkMode: (
      state,
      action: PayloadAction<(typeof initialGlobalState)["darkMode"] | undefined>
    ) => {
      if (action.payload) {
        state.darkMode = action.payload;
      } else {
        state.darkMode = state.darkMode ? false : true;
      }
    },
  },
});

export const {
  setSort,
  toggleSignUp,
  toggleSignIn,
  toggleResetPassword,
  toggleAdminMode,
  toggleDarkMode,
} = globalSlice.actions;

export const selectSort = (state: RootState) => state.global.sort;
export const selectSignUp = (state: RootState) => state.global.showSignUp;
export const selectSignIn = (state: RootState) => state.global.showSignIn;
export const selectAdminMode = (state: RootState) => state.global.adminMode;
export const selectDarkMode = (state: RootState) => state.global.darkMode;
export const selectResetPassword = (state: RootState) =>
  state.global.showResetPassword;

export default globalSlice.reducer;
