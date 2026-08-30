import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const BuyerProtectedRoute = () => {
  const { isAuthenticated, role } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/buyer/login" state={{ from: location }} replace />;
  }

  if (role !== 'buyer') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default BuyerProtectedRoute;
