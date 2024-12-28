import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  users: [], // Ensure users is initialized as an empty array
  loading: false,
  error: null,
};

// Thunk to Fetch Users
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async (_, thunkAPI) => {
  try {
    const response = await fetch("http://localhost:5000/api/admin/users"); // Adjust API endpoint
    if (!response.ok) throw new Error("Failed to fetch users");
    const data = await response.json();
    return data; // Ensure this returns an array of users
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Thunk to Update Block/Unblock Status
export const updateUserStatus = createAsyncThunk(
  "admin/updateStatus",
  async ({ id, isBlocked }, thunkAPI) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/users/${id}/block`,
        { isBlocked }, // Send the new status to the backend
        { withCredentials: true }
      );
      return { id, isBlocked }; // Return the user ID and new status
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to update status");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload; // Assuming the payload contains an array of users
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.loading = false;

        // Update the user's block/unblock status in the store
        const { id, isBlocked } = action.payload;
        const user = state.users.find((user) => user._id === id);
        if (user) {
          user.isBlocked = isBlocked; // Update the user's status
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUsers } = adminSlice.actions;
export default adminSlice.reducer;
