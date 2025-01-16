import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = 'http://localhost:5000/api/user';

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${api}/order`, { ...orderData }, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async ({ page, limit, search, status }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api}/order`, {
        params: { page, limit, search, status },
        withCredentials: true
      });
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api}/order/${id}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const cancelOrderItem = createAsyncThunk(
  'order/cancelOrderItem',
  async ({ orderId, itemId, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${api}/order/${orderId}/cancel`,
        { itemId, reason },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    order: null,
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.currentPage === 1) {
          state.orders = action.payload.orders;
        } else {
          state.orders = [...state.orders, ...action.payload.orders];
        }
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(cancelOrderItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelOrderItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
        const index = state.orders.findIndex(order => order.orderId === action.payload.orderId);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(cancelOrderItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export default orderSlice.reducer;
