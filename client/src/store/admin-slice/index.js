import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  users: [],
  categories: [],
  products: [],
};

const api = "http://localhost:5000/api/admin";

// Thunk to Fetch Users
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async ({ page = 1, limit = 10, search = '' } = {}, thunkAPI) => {
    try {
      const response = await axios.get(`${api}/users`, {
        params: { page, limit, search },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk to Update Block/Unblock Status
export const updateUserStatus = createAsyncThunk(
  "admin/updateStatus",
  async ({ id, isBlocked }, thunkAPI) => {
    try {
      await axios.patch(
        `${api}/users/${id}/block`,
        { isBlocked },
        { withCredentials: true }
      );
      return { id, isBlocked };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to update status");
    }
  }
);

export const getAllCategories = createAsyncThunk(
  "admin/getAllCategories",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${api}/categories`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const updateCategory = createAsyncThunk(
  "admin/updateCategory",
  async ({ id, name, status, image }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${api}/categories/${id}`,
        { name, status, image },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to update category");
    }
  }
)

export const addCategory = createAsyncThunk(
  "admin/addCategory",

  async (newCategory) => {
    const response = await axios.post(
      `${api}/categories`,
      newCategory,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

export const deleteCategory = createAsyncThunk(
  "admin/deleteCategory",
  async (id) => {
    const response = await axios.delete(
      `${api}/categories/${id}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
)

export const addProduct = createAsyncThunk(
  "admin/addProduct",
  async (formData) => {
    const response = await axios.post(
      `${api}/products`,
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

export const editProduct = createAsyncThunk(
  'admin/editProduct',
  async (formData) => {
      const response = await axios.put(`${api}/products/${formData.id}`, 
        formData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    }
);

export const getAllProducts = createAsyncThunk(
  "admin/getAllProducts",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${api}/products`);
      console.log(response)
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getProductDetails = createAsyncThunk(
  "admin/getProductDetails",
  async (id) => {
    const response = await axios.get(`${api}/products/${id}`);
    return response.data;
  }
);

export const uploadToCloudinary = createAsyncThunk(
  "admin/uploadToCloudinary",
  async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }
);

export const unlistProduct = createAsyncThunk(
  "admin/unlistProduct",
  async (id) => {
    const response = await axios.patch(
      `${api}/products/${id}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
)


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
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload.users;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        if (action.payload && action.payload.success) {
          state.categories.push(action.payload.category);
        } else {
          console.error("Failed to add category:", action.payload?.message || "Unknown error");
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((cat) => cat._id !== action.payload.categoryId);
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { id, isBlocked } = action.payload;
        const user = state.users.find((user) => user._id === id);
        if (user) {
          user.isBlocked = isBlocked; // Update the user's status
        }
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const updatedCategory = action.payload.category;
        const index = state.categories.findIndex((cat) => cat._id === updatedCategory._id);
        if (index !== -1) {
          state.categories[index] = updatedCategory;
        }
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        if (action.payload && action.payload.success) {
          state.products.push(action.payload.product);
        }
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
      })
      .addCase(unlistProduct.fulfilled, (state, action) => {
        const { productId }= action.payload;
        state.products = state.products.map(product =>
          product._id === productId ? { ...product, unListed: !product.unListed } : product
        );
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        const { productId }= action.payload;
        state.products = state.products.map(product =>
          product._id === productId ? { ...product, ...action.payload.product } : product
        );
      })
      

  },
});

export const { setUsers } = adminSlice.actions;
export default adminSlice.reducer;
