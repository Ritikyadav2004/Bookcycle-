import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const PublicRoute = () => {
  const { isAuthenticated, role } = useAuthStore();
  const location = useLocation();

  // If trying to access auth pages while logged in, redirect to respective dashboard
  if (isAuthenticated && (location.pathname.includes('/login') || location.pathname.includes('/register'))) {
    if (role === 'buyer') return <Navigate to="/buyer/dashboard" replace />;
    if (role === 'seller') return <Navigate to="/seller/dashboard" replace />;
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
