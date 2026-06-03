import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import { ROLE_HOME } from "@/config/navigation.js";

export default function RoleRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_HOME[user.role] || "/login"} replace />;
}
