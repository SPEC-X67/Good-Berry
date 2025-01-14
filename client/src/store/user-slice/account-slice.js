import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    user: null,
    addresses: [],
    isLoading: false,
    error: null,
};

const api = "http://localhost:5000/api/user";

// Helper function for error extraction
const extractError = (error) => error.response?.data?.error || 'Something went wrong';

// Thunks
export const getUser = createAsyncThunk(
    "account/getUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${api}/`, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(extractError(error));
        }
    }
);

export const updateUser = createAsyncThunk(
    "account/updateUser",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${api}/`, data, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(extractError(error));
        }
    }
);

export const updatePassword = createAsyncThunk(
    "account/updatePassword",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${api}/change-password`, data, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(extractError(error));
        }
    }
);

// Address Thunks
export const fetchAddresses = createAsyncThunk(
    "account/fetchAddresses",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${api}/addresses`, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(extractError(error));
        }
    }
);

export const addAddress = createAsyncThunk(
    "account/addAddress",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${api}/addresses`, data, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(extractError(error));
        }
    }
);

export const updateAddress = createAsyncThunk(
    "account/updateAddress",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${api}/addresses/${id}`, data, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(extractError(error));
        }
    }
);

export const deleteAddress = createAsyncThunk(
    "account/deleteAddress",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${api}/addresses/${id}`, { withCredentials: true });
            return { _id: id };
        } catch (error) {
            return rejectWithValue(extractError(error));
        }
    }
);


export const setDefault = createAsyncThunk(
    "account/setDefault",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${api}/addresses/${id}/set-default`, {}, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(extractError(error));
        }
    }
);

  
const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // User reducers
            .addCase(getUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoading = false;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoading = false;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

            .addCase(updatePassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updatePassword.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

            // Address reducers
            .addCase(fetchAddresses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.addresses = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

            .addCase(addAddress.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                if (action.payload.isDefault) {
                    state.addresses = state.addresses.map((addr) => ({
                        ...addr,
                        isDefault: false,
                    }));
                }
                state.addresses.unshift(action.payload);
                state.isLoading = false;
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

            .addCase(updateAddress.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                state.addresses = state.addresses.map((addr) =>
                    addr._id === action.payload._id
                        ? { ...addr, ...action.payload }
                        : { ...addr, isDefault: addr.isDefault && !action.payload.isDefault }
                );
                state.isLoading = false;
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

            .addCase(deleteAddress.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.addresses = state.addresses.filter(
                    (addr) => addr._id !== action.payload._id
                );
                state.isLoading = false;
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

            .addCase(setDefault.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(setDefault.fulfilled, (state, action) => {
                state.addresses = state.addresses.map((addr) =>
                    addr._id === action.payload._id
                        ? { ...addr, ...action.payload }
                        : { ...addr, isDefault: false }
                );
                state.isLoading = false;
            })
            .addCase(setDefault.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            });
    },
});

export const { clearError, setLoading } = accountSlice.actions;
export default accountSlice.reducer;
