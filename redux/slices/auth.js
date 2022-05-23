import { createSlice } from "@reduxjs/toolkit";
import jsCookie from "js-cookie";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        error: null,
    },
    reducers: {
        login: (state) => {
            state.isAuthenticated = true;
            state.error = null;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.error = null;
            
            jsCookie.remove("token");
            jsCookie.remove("id");
            jsCookie.remove("username");
            jsCookie.remove("email");
        },
        login_error: (state, action) => {
            state.error = action.payload;
        }
    },
});

export const { login, logout, login_error } = authSlice.actions;

export default authSlice.reducer;