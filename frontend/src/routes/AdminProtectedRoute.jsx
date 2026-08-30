import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const AdminProtectedRoute = () => {
  const { isAuthenticated, role } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
