import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = `${import.meta.env.VITE_API_BASE}/api/admin`;

export const fetchAllOrders = createAsyncThunk(
  'adminOrder/fetchAllOrders',
  async ({ page, limit, search, status }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api}/orders`, {
        params: { page, limit, search, status },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'adminOrder/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api}/orders/${orderId}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateOrderItemStatus = createAsyncThunk(
  'adminOrder/updateOrderItemStatus',
  async ({ orderId, productId, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${api}/orders/${orderId}/items/${productId}`,
        updates,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const approveReturnRequest = createAsyncThunk(
  'adminOrder/approveReturnRequest',
  async ({ orderId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${api}/orders/${orderId}/items/${productId}/approve-return`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const rejectReturnRequest = createAsyncThunk(
  'adminOrder/rejectReturnRequest',
  async ({ orderId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${api}/orders/${orderId}/items/${productId}/reject-return`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminOrderSlice = createSlice({
  name: 'adminOrder',
  initialState: {
    orders: [],
    orderDetails: null,
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.error = null;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderItemStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderItemStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload;
        state.error = null;
      })
      .addCase(updateOrderItemStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(approveReturnRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(approveReturnRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload;
        state.error = null;
      })
      .addCase(approveReturnRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(rejectReturnRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(rejectReturnRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload;
        state.error = null;
      })
      .addCase(rejectReturnRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export default adminOrderSlice.reducer;
