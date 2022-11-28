import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import axios from "axios";
import  { AxiosError } from 'axios';


interface AuthState {
  user: null | User;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string | unknown;
}

interface User {
  name?: string;
  email?: string;
  password?: string;
  token?: string;
  _id?: string;
}

// @ts-ignore
let userLocal: User = JSON.parse(localStorage.getItem("user"));

const initialState: AuthState = {
  user: userLocal ? userLocal : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const register = createAsyncThunk<User, User, { state: RootState }>(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const res = await axios.post<User>(
        "https://auth-api-o4bm.onrender.com/api/v1/users/register",
        data
      );
      if (res.data) {
        localStorage.setItem("user", JSON.stringify(res.data));
      }


      return res.data;
    } catch (error) {
      const err = error as AxiosError
      return thunkAPI.rejectWithValue((err.response?.data))
    }
  }
);

export const login = createAsyncThunk<User, User, { state: RootState }>(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const res = await axios.post<User>(
        "https://auth-api-o4bm.onrender.com/api/v1/users/login",
        data
      );
      if (res.data) {
        localStorage.setItem("user", JSON.stringify(res.data));
      }


      return res.data;
    } catch (error) {
      const err = error as AxiosError
      return thunkAPI.rejectWithValue((err.response?.data))
    }
  }
);

export const logout = createAsyncThunk("auth/logut", async () => {
  await localStorage.removeItem("user");
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;
