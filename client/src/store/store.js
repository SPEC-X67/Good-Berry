import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice';
import adminReducer from './admin-slice'
import shopReducer from './shop-slice';
import cartReducer from './shop-slice/cart-slice';
import userReducer from './user-slice/account-slice';
import orderReducer from './shop-slice/order-slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    shop: shopReducer,
    cart : cartReducer,
    account : userReducer,
    order : orderReducer
  }
})

export default store;