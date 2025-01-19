import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = 'http://localhost:5000/api/admin';

export const addCategoryOffer = createAsyncThunk(
  'offer/addCategoryOffer',
  async ({ categoryId, offerPercentage }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${api}/category/offer`, { categoryId, offerPercentage }, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeCategoryOffer = createAsyncThunk(
  'offer/removeCategoryOffer',
  async ({ categoryId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${api}/category/offer/remove`, { categoryId }, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addProductOffer = createAsyncThunk(
  'offer/addProductOffer',
  async ({ productId, offerPercentage }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${api}/products/${productId}/offer`, { offerPercentage }, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeProductOffer = createAsyncThunk(
  'offer/removeProductOffer',
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${api}/products/${productId}/offer`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const offerSlice = createSlice({
  name: 'offer',
  initialState: {
    isLoading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCategoryOffer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addCategoryOffer.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addCategoryOffer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(removeCategoryOffer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeCategoryOffer.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(removeCategoryOffer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addProductOffer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProductOffer.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addProductOffer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(removeProductOffer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeProductOffer.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(removeProductOffer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export default offerSlice.reducer;
