// store/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserData = {
  username: string;
  password: string;
};

type AuthState = {
  user: UserData | null;
};

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("userData") || "null"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn(state, action: PayloadAction<UserData>) {
      state.user = action.payload;
      localStorage.setItem("userData", JSON.stringify(action.payload));
    },
    signOut(state) {
      state.user = null;
      localStorage.removeItem("userData");
    },
  },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;
