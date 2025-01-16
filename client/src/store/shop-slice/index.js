import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    products: [],
    featuredProds: [],
    pagination : {},
    product : {},
    recomentedProds : [],
    pflavors: [],
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
    async ({ page, limit, sort = 'featured' }) => {
      const response = await axios.get(
        `${api}/products?page=${page}&limit=${limit}&sort=${sort}`
      );
      return response.data;
    }
  );

export const getSingleProduct = createAsyncThunk(
    "shop/getSingleProduct",
    async (id) => {
      const response = await axios.get(`${api}/products/${id}`);
      return response.data;
    }
)



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
        })

        .addCase(getSingleProduct.fulfilled, (state, action) => {
            state.product = action.payload.product;
            state.recomentedProds = action.payload.recommendedProducts;
            state.pflavors = action.payload.variantsFormatted;
        })
    },
});

export default shopSlice.reducer;
