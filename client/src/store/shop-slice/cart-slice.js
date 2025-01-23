import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = 'http://localhost:5000/api/user';

const cartStorage = {
  load: () => {
    try {
      const cartItems = localStorage.getItem('cartItems');
      return cartItems ? JSON.parse(cartItems) : [];
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      return [];
    }
  },
  save: (items) => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  },
  clear: () => {
    try {
      localStorage.removeItem('cartItems');
    } catch (error) {
      console.error('Error clearing cart from storage:', error);
    }
  }
};

export const syncCartAfterLogin = createAsyncThunk(
  'cart/syncCartAfterLogin',
  async () => {
    const localCart = cartStorage.load();

    if (localCart.length === 0) {
      return;
    }

    try {
      const response = await axios.post(`${api}/cart/sync`, localCart, {
        withCredentials: true,
      });

      cartStorage.clear();

      return response.data;
    } catch (error) {
      console.error('Error syncing cart after login:', error);
      throw error;
    }
  }
);

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState }) => {
    const { auth } = getState();

    if (!auth.user) {
      return cartStorage.load();
    }

    try {
      const response = await axios.get(`${api}/cart`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (cartItem, { getState }) => {
    const { auth } = getState();
    const itemToAdd = { ...cartItem };

    if (!auth.user) {
      delete itemToAdd.userId;
      const currentCart = cartStorage.load();
      const existingItemIndex = currentCart.findIndex(
        item => item.productId === itemToAdd.productId &&
          item.packageSize === itemToAdd.packageSize &&
          item.flavor === itemToAdd.flavor
      );

      let updatedCart;
      if (existingItemIndex > -1) {
        updatedCart = currentCart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + itemToAdd.quantity }
            : item
        );
      } else {
        updatedCart = [...currentCart, itemToAdd];
      }

      cartStorage.save(updatedCart);
      return updatedCart;
    }

    try {
      const response = await axios.post(`${api}/cart`, itemToAdd, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ itemId, quantity, packageSize, flavor }, { getState }) => {
    const { auth } = getState();

    if (!auth.user) {
      const currentCart = cartStorage.load();
      const updatedCart = currentCart.map(item =>
        item.productId === itemId &&
          item.packageSize === packageSize &&
          item.flavor === flavor
          ? { ...item, quantity }
          : item
      );
      cartStorage.save(updatedCart);
      return updatedCart;
    }

    try {
      const response = await axios.put(`${api}/cart/${itemId}`, {
        quantity,
        packageSize,
        flavor
      }, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async ({ itemId, packageSize, flavor }, { getState }) => {
    const { auth } = getState();

    if (!auth.user) {
      const currentCart = cartStorage.load();
      const updatedCart = currentCart.filter(
        item => !(item.productId === itemId &&
          item.packageSize === packageSize &&
          item.flavor === flavor)
      );
      cartStorage.save(updatedCart);
      return { itemId, packageSize, flavor };
    }

    try {
      await axios.delete(`${api}/cart/${itemId}`, {
        data: { packageSize, flavor },
        withCredentials: true,
      });
      return { itemId, packageSize, flavor };
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }
);

export const checkQuantity = createAsyncThunk(
  'cart/checkQuantity',
  async ({ productId, packageSize, flavor }) => {
    try {
      const response = await axios.post(`${api}/check-quantity`, { productId, packageSize, flavor }, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error checking quantity:', error);
      throw error;
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    quantity: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      cartStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(syncCartAfterLogin.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = action.payload;
        }
        state.error = null;
      })
      .addCase(syncCartAfterLogin.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(addToCart.pending, (state) => {
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const { itemId, packageSize, flavor } = action.payload;
        state.items = state.items.filter(
          item => !(item.productId === itemId &&
            item.packageSize === packageSize &&
            item.flavor === flavor)
        );
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.items = action.payload;
        state.error = null;
      })
      .addCase(checkQuantity.pending, (state) => {
        state.error = null;
      })
      .addCase(checkQuantity.fulfilled, (state, action) => {
        state.quantity = action.payload.quantity;
        state.error = null;
      })
      .addCase(checkQuantity.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;