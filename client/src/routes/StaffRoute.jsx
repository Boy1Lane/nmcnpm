import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function StaffRoute({ children }) {
  const { user, loading } = useAuth();

  // ⏳ đợi load xong auth (tránh nháy)
  if (loading) return null;

  // ❌ chưa login
  if (!user) return <Navigate to="/login" replace />;

  // ❌ customer bị chặn
  if (!["admin", "staff"].includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
