import {
  createSlice,
  PayloadAction,
  // createAsyncThunk,
} from "@reduxjs/toolkit";
import { AppState } from ".";
import { User } from "./types";
import {
  login,
  // register,
  logout,
} from "./api";

type AuthState = {
  token?: string;
  profile?: User;
};

const initialState: AuthState = {
  token: undefined,
  profile: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => ({
      ...initialState,
    }));
    builder.addCase(login.fulfilled, (state, action) => {
      return {
        ...state,
        profile: action.payload,
        token: action.payload.appToken,
      };
    });
    builder.addCase(login.rejected, (state, action) => {
      return {
        ...state,
        profile: undefined,
        token: undefined,
      };
    });
    // builder.addCase(register.fulfilled, (state, action) => {
    //   state.profile = action.payload;
    //   state.token = action.payload.appToken;
    // });
    // builder.addCase(register.rejected, (state, action) => {
    //   state.profile = undefined;
    //   state.token = undefined;
    // });
  },
});

export const { reset } = authSlice.actions;

export const $auth = (state: AppState): AuthState => state.auth;
export const $isAuthenticated = (state: AppState) =>
  state.auth && !!state.auth.token;

export default authSlice.reducer;
