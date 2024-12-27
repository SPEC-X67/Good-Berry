import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const isAdmin = user?.role === "admin";

  // Redirect unauthenticated users from protected shop routes
  const isProtectedShopRoute = location.pathname.includes("/shop/");
  if (!isAuthenticated && isProtectedShopRoute) {
    return <Navigate to="/auth/login" />;
  } 
  // Redirect authenticated users away from login/register pages
  const isAuthPage = location.pathname.includes("/auth");
  if (isAuthenticated && isAuthPage) {
    return <Navigate to="/" />;
  }

  const isAdminPage = location.pathname.startsWith("/admin");
  if (!isAuthenticated && isAdminPage) {
    return <Navigate to="/auth/login" />;
  }

  if (isAuthenticated && isAdminPage && !isAdmin) {
    return <Navigate to="/unauth-page" />;
  }

  // Prevent admin users from accessing shop routes
  if (isAuthenticated && isAdmin && location.pathname.startsWith("/shop")) {
    return <Navigate to="/admin/dashboard" />;
  }

  // Allow access to protected routes if conditions are met
  return children;
}

export default CheckAuth;
