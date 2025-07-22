// redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { logoutUser } from "../utils/apiCalls";
import { persistStore } from "redux-persist";
import { persistor, store } from "./store";

const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      logoutUser();
      // persistStore(store).purge(); // <<<< this line clears all persisted storage
      // persistor.purge(); // these purge commands are not working to remove the persist:auth entry from localstorage even after logout
      window.location.href = "/";
    },
  },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
