import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  // ⏳ Chờ load xong localStorage
  //   if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
