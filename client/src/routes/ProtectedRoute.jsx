import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute component that handles authentication and role-based access control
 * 
 * @param {Object} props
 * @param {React.Component} props.children - The component to render if authorized
 * @param {string[]} props.allowedRoles - Array of roles allowed to access this route
 * @returns {React.Component} - Renders children, redirects to login, or redirects to appropriate dashboard
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is in the allowed roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to role-appropriate dashboard
    const dashboardRoutes = {
      jobSeeker: '/jobseeker/dashboard',
      employer: '/employer/dashboard',
      admin: '/admin/dashboard',
    };

    const redirectPath = dashboardRoutes[user.role] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated and has the correct role
  return children;
};

export default ProtectedRoute;
