import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: "user",
    initialState: {},
    reducers: {
        setUser: (state, action) => {
            let user = { ...action.payload };
            return {...state, ...user};
        },
        removeUser: () => {
            return {};
        }
    },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;