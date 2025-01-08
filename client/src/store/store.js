import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice';
import adminReducer from './admin-slice'
import shopReducer from './shop-slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    shop: shopReducer,
  }
})

export default store;