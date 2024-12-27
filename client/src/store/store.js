import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice';
import adminReducer from './admin-slice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
  }
})

export default store;