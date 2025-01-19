import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice';
import adminReducer from './admin-slice';
import shopReducer from './shop-slice';
import cartReducer from './shop-slice/cart-slice';
import userReducer from './user-slice/account-slice';
import orderReducer from './shop-slice/order-slice';
import adminOrderReducer from './admin-slice/order-slice';
import offerReducer from './admin-slice/offer-slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    shop: shopReducer,
    cart: cartReducer,
    account: userReducer,
    order: orderReducer,
    adminOrder: adminOrderReducer,
    offer: offerReducer,
  }
});

export default store;