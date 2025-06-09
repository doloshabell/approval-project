import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserData = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: {
    id: number;
    name: string;
    code: string;
  };
  district: {
    id: number;
    name: string;
    code: string;
    estate: {
      id: number;
      name: string;
      code: string;
    };
  };
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
    signOut: (state) => { 
      state.user = null;
      localStorage.removeItem("userData");
      localStorage.removeItem("userToken");
    }
    
  },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;
