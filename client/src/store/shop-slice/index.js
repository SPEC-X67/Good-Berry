import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    products: [],
    loading: false,
    categories : [],
    featuredProds: [],
    pagination : {},
    product : {},
    recomentedProds : [],
    pflavors: [],
    wishlist: [], 
    coupon: {},
    error : null
};

const api = "http://localhost:5000/api";

export const featuredProducts = createAsyncThunk(
    "shop/featuredProducts",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${api}/featured`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error.message });
        }    
    }
);


export const getProducts = createAsyncThunk(
    "shop/getProducts",
    async ({ page, limit, sort = 'featured', search = '', minPrice, maxPrice, categories}) => {
      try {
        const response = await axios.get(
          `${api}/products?page=${page}&limit=${limit}&sort=${sort}&search=${search}&minPrice=${minPrice}&maxPrice=${maxPrice}&categories=${categories}`
        );
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
  );

export const getSingleProduct = createAsyncThunk(
    "shop/getSingleProduct",
    async (id) => {
      const response = await axios.get(`${api}/products/${id}`);
      return response.data;
    }
)

export const getWishlist = createAsyncThunk(
    "wishlist/getWishlist",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${api}/user/wishlist`, { withCredentials: true });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    }
);

export const addToWishlist = createAsyncThunk(
    "wishlist/addToWishlist",
    async ({productId, variantId}, thunkAPI) => {
        try {
            const response = await axios.post(`${api}/user/wishlist`, { productId, variantId }, { withCredentials: true });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    }
);

export const removeFromWishlist = createAsyncThunk(
    "wishlist/removeFromWishlist",
    async ({ productId, variantId }, thunkAPI) => {
        try {
            const response = await axios.delete(`${api}/user/wishlist/${productId}/${variantId}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    }
);

export const getCategories = createAsyncThunk(
    "shop/getCategories",
    async () => {
      const response = await axios.get(`${api}/categories`, { withCredentials: true });
      return response.data;
    }
  );

export const applyCoupon = createAsyncThunk(
  "shop/applyCoupon",
  async ({ code, total }, thunkAPI) => {
    try {
      const response = await axios.post(`${api}/user/apply-coupon`, { code, total }, { withCredentials: true });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const checkCoupon = createAsyncThunk(
  "shop/checkCoupon",
  async ({ code, total }, thunkAPI) => {
    try {
      const response = await axios.post(`${api}/user/check-coupon`, { code, total }, { withCredentials: true });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

const shopSlice = createSlice({
    name: "shop",
    initialState,
    reducers: {},
    extraReducers: (builder) => {        
        builder.addCase(featuredProducts.fulfilled, (state, action) => {
            state.featuredProds = action.payload.data;
            state.product = {};
            state.pflavors = [];
            state.recomentedProds = []; 
        })
        .addCase(getProducts.fulfilled, (state, action) => {
            state.products = action.payload.data;
            state.pagination = action.payload.pagination;
            state.product = {};
            state.pflavors = [];
            state.recomentedProds = []; 
        })
        .addCase(getSingleProduct.pending, (state) => {
            state.product = null;
            state.pflavors = null;
            state.recomentedProds = null; 
            state.error = null;
        })

        .addCase(getSingleProduct.fulfilled, (state, action) => {
            state.product = action.payload.product;
            state.recomentedProds = action.payload.recommendedProducts;
            state.pflavors = action.payload.variantsFormatted;
            state.error = null;
        })

        .addCase(getSingleProduct.rejected, (state) => {
            state.product = null;
            state.pflavors = null;
            state.recomentedProds = null; 
            state.error = "Product not found";
        })

        .addCase(getWishlist.rejected, (state) => {
          state.wishlist = [];
        })
        .addCase(getWishlist.fulfilled, (state, action) => {
            state.wishlist = action.payload.data;
        })
        .addCase(addToWishlist.fulfilled, (state, action) => {
            state.wishlist.push(action.payload.data);
        })
        .addCase(removeFromWishlist.fulfilled, (state, action) => {
            state.wishlist = state.wishlist.filter(item => item.productId !== action.meta.arg.productId || item.variantId !== action.meta.arg.variantId);
        })

        .addCase(getCategories.fulfilled, (state, action) => {
            state.categories = action.payload.data;
        })
        .addCase(applyCoupon.fulfilled, (state, action) => {
            state.coupon = action.payload;
        })
        .addCase(checkCoupon.fulfilled, (state, action) => {
            state.coupon = action.payload;
        })
    },
});

export default shopSlice.reducer;
