import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { Types } from "mongoose";

export const initialUserState: {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  bookmarks: Types.ObjectId[];
  profilePicture: string;
} = {
  _id: "",
  username: "",
  email: "",
  role: "user",
  bookmarks: [],
  profilePicture: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setUser: (state, action: PayloadAction<typeof initialUserState>) => {
      const { _id, username, email, role, bookmarks, profilePicture } =
        action.payload;
      state._id = _id;
      state.username = username;
      state.email = email;
      state.role = role;
      state.bookmarks = bookmarks;
      state.profilePicture = profilePicture;
    },
  },
});

export const { setUser } = userSlice.actions;

export const selectUserState = (state: RootState) => state.user;

export default userSlice.reducer;
