import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin/layout";
import AdminDashboard from "./pages/admin/dashboard";
import AdminProducts from "./pages/admin/ProductsCategorys/products";
import AdminCategorys from "./pages/admin/ProductsCategorys/categorys";
import AdminOrders from "./pages/admin/order/orders";
import AdminFeatures from "./pages/admin/features";
import ShopLayout from "./components/shop/layout";
import ShoppingHome from "./pages/shop/Home/home";
import ShoppingCheckout from "./pages/shop/cart/checkout";
import NotFound from "./pages/404";
import CheckAuth from "./components/common/check-auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import ShoppingListing from "./pages/shop/Listing/products";
import CustomersPage from "./pages/admin/customers";
import ProductForm from "./pages/admin/ProductsCategorys/product-form";
import ProductPage from "./pages/shop/Product/product-page";
import ForgetPassword from "./pages/auth/forget-password";
import VeryOtp from "./pages/auth/verify-otp";
import Account from "./pages/user";
import { fetchCart, syncCartAfterLogin } from "./store/shop-slice/cart-slice";
import ShoppingCart from "./pages/shop/cart/shopping-cart";
import OrderView from "./pages/shop/cart/view-order";
import OrderDetails from "./pages/admin/order/order-details";
import ResetPassword from "./pages/auth/reset-password";
import SearchProduct from "./pages/shop/Listing/search-product";
import CouponManagement from "./pages/admin/coupon";
import SalesReportPage from "./pages/admin/sales-report";
import { FaSpinner } from "react-icons/fa";

function App() {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      dispatch(syncCartAfterLogin());
    }
  }, [dispatch, user]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="animate-spin w-6 h-6" />
      </div>
    );

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<ShopLayout />}>
          <Route index element={<ShoppingHome />} /> {/* Home Page */}
          <Route path="shop" element={<ShoppingListing />} />
          <Route path="shop/product/:id" element={<ProductPage />} />
          <Route path="search" element={<SearchProduct/>}/>
        </Route>

        {/* Protected Shop Routes */}
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShopLayout />
            </CheckAuth>
          }
        >
          <Route path="cart">
            <Route index element={<ShoppingCart />} />
            <Route path="checkout" element={<ShoppingCheckout />} />
          </Route>
        </Route>

        <Route
          path="/account"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShopLayout />
            </CheckAuth>
          }
        >
          <Route index element={<Account />} />
          <Route path="order" element={<Account />} />
          <Route path="order/:id" element={<OrderView />} />
        </Route>

        {/* Auth Routes */}
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route index element={<AuthLogin />} />
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
          <Route path="verify-email" element={<VeryOtp />} />
          <Route path="login/forgot-password" element={<ForgetPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="products">
            <Route index element={<AdminProducts />} />
            <Route path="add" element={<ProductForm />} />
            <Route path="edit/:id" element={<ProductForm />} />
          </Route>
          <Route path="categorys" element={<AdminCategorys />} />
          <Route path="orders" >
            <Route index element={<AdminOrders />} />
            <Route path=":orderId" element={<OrderDetails />} />
          </Route>
          <Route path="features" element={<AdminFeatures />} />
          <Route path="coupons" element={<CouponManagement />} />
          <Route path="sales-report" element={<SalesReportPage />} />
        </Route>

        {/* Catch-All Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
