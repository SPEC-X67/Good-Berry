import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  users: [], 
  loading: false,
  error: null,
  categories :[],
  products: [],
};

const api = "http://localhost:5000/api/admin";

// Thunk to Fetch Users
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async (_, thunkAPI) => {
  try {
    const response = await fetch(`${api}/users`); 
    if (!response.ok) throw new Error("Failed to fetch users");
    const data = await response.json();
    return data; 
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
  async ({ id, name, status }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${api}/categories/${id}`,
        { name, status }, 
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
  async (newProduct) => {
      const response = await axios.post(
          `${api}/products`,
          newProduct,
          {
              headers: { 'Content-Type': 'multipart/form-data' },
              withCredentials: true,
          }      
      );
      return response.data;
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
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        if (action.payload && action.payload.success) {
          state.categories.push(action.payload.category);
        } else {
          console.error("Failed to add category:", action.payload?.message || "Unknown error");
        }
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter((cat) => cat._id !== action.payload.categoryId);
      })

      .addCase(updateUserStatus.fulfilled, (state, action) => {
        // Update the user's block/unblock status in the store
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
        } else {
          console.error("Failed to add product:", action.payload?.message || "Unknown error");
        }
      })
  },
});

export const { setUsers } = adminSlice.actions;
export default adminSlice.reducer;
