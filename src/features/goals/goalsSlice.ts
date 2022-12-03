import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import { AxiosError } from "axios";

interface Goal {
  text: string;
  _id?: string;
  createdAt?: string;
}

export interface GoalState {
  goals: Goal[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string | unknown;
}

const initialState: GoalState = {
  goals: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const createGoal = createAsyncThunk<Goal, Goal, { state: RootState }>(
  "goals/createGoal",
  async (goalData, thunkAPI) => {
    try {
      const url = "https://auth-api-o4bm.onrender.com/api/v1/goals/";
      const res = await axios.post(url, goalData, {
        headers: {
          Authorization: `Bearer ${thunkAPI.getState().auth.user?.token}`,
        },
      });
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const getGoals = createAsyncThunk<Goal[], Goal, { state: RootState }>(
  "goals/getGoals",
  async (_, thunkAPI) => {
    try {
      const url = "https://auth-api-o4bm.onrender.com/api/v1/goals/";

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${thunkAPI.getState().auth.user?.token}`,
        },
      });
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const deleteGoal = createAsyncThunk<string, string, { state: RootState } >("goals/deleteGoal", async (id, thunkAPI) => {
  try {
    const url = "https://auth-api-o4bm.onrender.com/api/v1/goals/";
    const response = await axios.delete(url + id, {
      headers: {
        Authorization: `Bearer ${thunkAPI.getState().auth.user?.token}`,
      },
    });

    return response.data.id;
  } catch (error) {
    const err = error as AxiosError;

    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const goalsSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGoal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.goals.push(action.payload);
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      })
      .addCase(getGoals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getGoals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.goals = action.payload;
      })
      .addCase(getGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      })
      .addCase(deleteGoal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.goals = state.goals.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      });
  },
});

export const { reset } = goalsSlice.actions;

export default goalsSlice.reducer;
