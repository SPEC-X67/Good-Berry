import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice';
import adminReducer from './admin-slice'
import shopReducer from './shop-slice';
import cartReducer from './shop-slice/cart-slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    shop: shopReducer,
    cart : cartReducer
  }
})

export default store;