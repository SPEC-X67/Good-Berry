import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    user: null,
    isLoading: false,
    error: null,
};

const api = "http://localhost:5000/api/user";

export const getUser = createAsyncThunk(
    "account/getUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${api}/`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch user');
        }
    }
);

export const updateUser = createAsyncThunk(
    "account/updateUser",
    async (data, { rejectWithValue }) => {
        console.log(data);
        try {
            const response = await axios.patch(`${api}/`, data, {
                withCredentials: true
            });
            return response.data;    
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update user');
        }
    }
);

export const updatePassword = createAsyncThunk(
    "account/updatePassword",
    async (data, { rejectWithValue}) => {
        try {
            const response = await axios.patch(`${api}/change-password`, data, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update password');
        }
    }
)

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        
        // Get User
            .addCase(getUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

        // Update User
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.user = action.payload.data;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

        // Update Password
            .addCase(updatePassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updatePassword.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })    
    }
});

export default accountSlice.reducer;