import { createSlice } from "@reduxjs/toolkit";
import { logoutUser } from "../utils/apiCalls";

const initialState = {
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload);
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      logoutUser();
      window.location.href = "/";
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
