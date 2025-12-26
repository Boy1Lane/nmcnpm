import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminRoute from "./routes/AdminRoute.jsx";

import AdminLayout from "./layout/AdminLayout.jsx";

// Admin pages
import Dashboard from "./pages/Admin/Dashboard.jsx";
import MovieManagement from "./pages/Admin/MovieManagement.jsx";
import RoomManagement from "./pages/Admin/Rooms/RoomManagement.jsx";
import ShowtimesPage from "./pages/Admin/Showtimes/ShowtimesPage.jsx";
import RevenueReport from "./pages/Admin/Reports/RevenueReport.jsx";
import UserManagement from "./pages/Admin/Users/UserManagement.jsx";

// Auth pages
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ===== PUBLIC ===== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ===== ADMIN (BỊ CHẶN BỞI AdminRoute) ===== */}
        <Route
          path="/"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="movie-management" element={<MovieManagement />} />
          <Route path="room-seat" element={<RoomManagement />} />
          <Route path="showtimes" element={<ShowtimesPage />} />
          <Route path="report" element={<RevenueReport />} />
          <Route path="user" element={<UserManagement />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
