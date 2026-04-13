import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Role not allowed
  if (!allowedRoles.includes(user.role)) {

    // 🔥 FIX: redirect based on role
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === "student") {
      return <Navigate to="/student" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  // ✅ Allowed
  return children;
};

export default ProtectedRoute;