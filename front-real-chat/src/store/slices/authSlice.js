import { createSlice } from "@reduxjs/toolkit";

export const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: null,
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

export const { setUserInfo } = AuthSlice.actions;

export default AuthSlice.reducer;
