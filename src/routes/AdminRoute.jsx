import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import { isDevelopmentAuthBypass } from '../utils/devAuth';

export default function AdminRoute() {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated && !isDevelopmentAuthBypass) {
    return <Navigate to="/login" replace />;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/403" replace />;
}
