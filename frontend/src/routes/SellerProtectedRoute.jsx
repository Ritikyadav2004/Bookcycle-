import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const SellerProtectedRoute = () => {
  const { isAuthenticated, role } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/seller/login" state={{ from: location }} replace />;
  }

  if (role !== 'seller') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default SellerProtectedRoute;
