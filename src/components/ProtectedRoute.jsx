import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ role, children }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    const loginPath =
      role === 'restaurant' ? '/restaurant/login' : role === 'rider' ? '/rider/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location.pathname }} replace />;
  }

  if (role && currentUser.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
