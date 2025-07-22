import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  // If user not logged in, redirect to login
  if (!isAuthenticated || !token || !user) {
    return <Navigate to="/" />;
  }

  // If user role is not allowed, redirect to unauthorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  // All good, render the protected component
  return children;
};

export default ProtectedRoute;
