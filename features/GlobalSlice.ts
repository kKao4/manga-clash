import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";

export const initialGlobalState: {
  sort: "latest" | "a-z" | "rating" | "views" | "new";
  showSignUp: boolean;
  showSignIn: boolean;
  showResetPassword: boolean;
  adminMode: boolean;
  showGuide: boolean;
} = {
  sort: "latest",
  showSignUp: false,
  showSignIn: false,
  showResetPassword: false,
  adminMode: false,
  showGuide: false,
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
    toggleAdminMode: (
      state,
      action: PayloadAction<
        (typeof initialGlobalState)["adminMode"] | undefined
      >
    ) => {
      if (action.payload) {
        state.adminMode = action.payload;
      } else {
        state.adminMode = !state.adminMode;
      }
    },
    toggleGuide: (
      state,
      action: PayloadAction<(typeof initialGlobalState)["showGuide"]>
    ) => {
      state.showGuide = action.payload;
    },
  },
});

export const {
  setSort,
  toggleSignUp,
  toggleSignIn,
  toggleResetPassword,
  toggleAdminMode,
  toggleGuide,
} = globalSlice.actions;

export const selectSort = (state: RootState) => state.global.sort;
export const selectSignUp = (state: RootState) => state.global.showSignUp;
export const selectSignIn = (state: RootState) => state.global.showSignIn;
export const selectAdminMode = (state: RootState) => state.global.adminMode;
export const selectGuide = (state: RootState) => state.global.showGuide;
export const selectResetPassword = (state: RootState) =>
  state.global.showResetPassword;

export default globalSlice.reducer;
