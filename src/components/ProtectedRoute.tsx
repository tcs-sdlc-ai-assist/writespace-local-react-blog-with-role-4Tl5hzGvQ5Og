import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../utils/auth';
import { UserRole } from '../utils/types';

interface ProtectedRouteProps {
  role?: UserRole;
}

export function ProtectedRoute({ role }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (role) {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== role) {
      return <Navigate to="/blogs" replace />;
    }
  }

  return <Outlet />;
}