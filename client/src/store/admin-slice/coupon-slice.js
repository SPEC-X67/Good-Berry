import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = `${import.meta.env.VITE_API_BASE}/api/admin`;

export const fetchCoupons = createAsyncThunk('coupons/fetchCoupons', async ({ page, search }) => {
  const response = await axios.get(`${api}/coupons?page=${page}&search=${search}`, { withCredentials: true });
  return response.data;
});

export const addCoupon = createAsyncThunk('coupons/addCoupon', async (couponData, { dispatch }) => {
  const response = await axios.post(`${api}/coupons`, couponData, { withCredentials: true });
  dispatch(fetchCoupons({ page: 1, search: '' }));
  return response.data;
});

export const updateCoupon = createAsyncThunk('coupons/updateCoupon', async ({ id, couponData }, { dispatch }) => {
  const response = await axios.put(`${api}/coupons/${id}`, couponData, { withCredentials: true });
  dispatch(fetchCoupons({ page: 1, search: '' }));
  return response.data;
});

export const deleteCoupon = createAsyncThunk('coupons/deleteCoupon', async (id, { dispatch }) => {
  await axios.delete(`${api}/coupons/${id}`, { withCredentials: true });
  dispatch(fetchCoupons({ page: 1, search: '' }));
  return id;
});

const couponSlice = createSlice({
  name: 'coupons',
  initialState: {
    coupons: [],
    totalPages: 1,
    currentPage: 1,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload.coupons;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addCoupon.fulfilled, (state, action) => {
        state.coupons.push(action.payload.coupon);
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        const index = state.coupons.findIndex(coupon => coupon._id === action.payload.coupon._id);
        if (index !== -1) {
          state.coupons[index] = action.payload.coupon;
        }
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter(coupon => coupon._id !== action.payload);
      });
  },
});

export default couponSlice.reducer;
