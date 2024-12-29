import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin/layout";
import AdminDashboard from "./pages/admin/dashboard";
import AdminProducts from "./pages/admin/ProductsCategorys/products";
import AdminCategorys from "./pages/admin/ProductsCategorys/categorys"
import AdminOrders from "./pages/admin/orders";
import AdminFeatures from "./pages/admin/features";
import ShopLayout from "./components/shop/layout";
import ShoppingHome from "./pages/shop/Home";
import ShoppingCheckout from "./pages/shop/checkout";
import ShoppingAccount from "./pages/shop/account";
import NotFound from "./pages/404";
import CheckAuth from "./components/common/check-auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import ShoppingListing from "./pages/shop/listing";
import { Skeleton } from "@/components/ui/skeleton"
import CustomersPage from "./pages/admin/Customers/customers";
import AddProduct from "./pages/admin/ProductsCategorys/AddProduct";


function App() {
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="w-[100px] h-[20px] rounded-full" />  ;
  console.log(isLoading, user);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<ShopLayout />}>
          <Route index element={<ShoppingHome />} /> {/* Home Page */}
          <Route path="shop" element={<ShoppingListing />} /> {/* Product Listing */}
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
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
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
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
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
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="categorys" element={<AdminCategorys/>} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>

        {/* Catch-All Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
