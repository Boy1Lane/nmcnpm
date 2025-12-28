import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminRoute from "./routes/AdminRoute.jsx";
import StaffRoute from "./routes/StaffRoute.jsx";

import AdminLayout from "./layout/AdminLayout.jsx";

// Admin pages
import Dashboard from "./pages/Admin/Dashboard.jsx";
import MovieManagement from "./pages/Admin/MovieManagement.jsx";
import RoomManagement from "./pages/Admin/Rooms/RoomManagement.jsx";
import ShowtimesPage from "./pages/Admin/Showtimes/ShowtimesPage.jsx";
import RevenueReport from "./pages/Admin/Reports/RevenueReport.jsx";
import UserManagement from "./pages/Admin/Users/UserManagement.jsx";

// Staff pages
import CheckInPage from "./pages/Staff/Checkin/CheckinPage.jsx";

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

        {/* ===== ADMIN + STAFF (KHUNG CHUNG) ===== */}
        <Route
          path="/"
          element={
            <StaffRoute>
              <AdminLayout />
            </StaffRoute>
          }
        >
          {/* ===== STAFF + ADMIN ===== */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="check-in" element={<CheckInPage />} />

          {/* ===== ADMIN ONLY ===== */}
          <Route
            path="movie-management"
            element={
              <AdminRoute>
                <MovieManagement />
              </AdminRoute>
            }
          />

          <Route
            path="room-seat"
            element={
              <AdminRoute>
                <RoomManagement />
              </AdminRoute>
            }
          />

          <Route
            path="showtimes"
            element={
              <AdminRoute>
                <ShowtimesPage />
              </AdminRoute>
            }
          />

          <Route
            path="report"
            element={
              <AdminRoute>
                <RevenueReport />
              </AdminRoute>
            }
          />

          <Route
            path="user"
            element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
