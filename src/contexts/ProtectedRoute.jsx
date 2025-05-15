import { useAuth } from './AuthProvider';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children, adminOnly, userOnly, payOnly, blockBanned = true }) => {
  const { isAuthenticated, isAdmin, isUser, isPay, isBanned } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Nếu tài khoản bị cấm
  if (blockBanned && isBanned) {
    return <Navigate to="/ban" />;
  }

  // Phân quyền
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  if (userOnly && !isUser) {
    return <Navigate to="/" />;
  }

  if (payOnly && !isPay) {
    return <Navigate to="/pay" />;
  }

  return children;
};
