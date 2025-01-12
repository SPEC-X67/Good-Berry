// cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const loadCartFromStorage = () => {
  try {
    const cartItems = localStorage.getItem('cartItems');
    return cartItems ? JSON.parse(cartItems) : [];
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return [];
  }
};

// Async thunks for cart operations
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState }) => {
    const { auth } = getState();
    if (!auth.isAuthenticated) {
      return loadCartFromStorage();
    }
    
    try {
      const response = await axios.get('/api/cart');
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
    
    if (!auth.isAuthenticated) {
      const currentCart = loadCartFromStorage();
      const existingItemIndex = currentCart.findIndex(
        item => item.productId === cartItem.productId && 
               item.flavor === cartItem.flavor &&
               item.packageSize === cartItem.packageSize
      );

      let updatedCart;
      if (existingItemIndex > -1) {
        updatedCart = currentCart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + cartItem.quantity }
            : item
        );
      } else {
        updatedCart = [...currentCart, cartItem];
      }

      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      return updatedCart;
    }
    
    try {
      const response = await axios.post('/api/cart', cartItem);
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ itemId, quantity, packageSize }, { getState }) => {
    const { auth } = getState();
    
    if (!auth.isAuthenticated) {
      const currentCart = loadCartFromStorage();
      const updatedCart = currentCart.map(item =>
        item.productId === itemId && item.packageSize === packageSize 
          ? { ...item, quantity } 
          : item
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      return updatedCart;
    }
    
    try {
      const response = await axios.put(`/api/cart/${itemId}`, { 
        quantity,
        packageSize 
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
  async ({ itemId, packageSize }, { getState }) => {
    const { auth } = getState();
    
    if (!auth.isAuthenticated) {
      const currentCart = loadCartFromStorage();
      const updatedCart = currentCart.filter(
        item => !(item.productId === itemId && item.packageSize === packageSize)
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      return { itemId, packageSize };
    }
    
    try {
      await axios.delete(`/api/cart/${itemId}`, { 
        data: { packageSize } 
      });
      return { itemId, packageSize };
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cartItems');
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
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
      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const { itemId, packageSize } = action.payload;
        state.items = state.items.filter(
          item => !(item.productId === itemId && item.packageSize === packageSize)
        );
        state.loading = false;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.items = action.payload;

        console.log("Action",action.payload);
        state.loading = false;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;