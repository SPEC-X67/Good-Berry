import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    users: null
}

export const fetchUsers = createAsyncThunk(
    "/admin/fetchUsers",
    async (_, thunkAPI) => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/users", {
          withCredentials: true,
        });
        return response.data; 
      } catch (error) {
        // Use thunkAPI to handle errors
        return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch users");
      }
    }
  );
  

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setUser: () => { }
    },
    extraReducers: (builder) => {
        builder
        // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    }
});

export const { setUser } = adminSlice.actions;
export default adminSlice.reducer;