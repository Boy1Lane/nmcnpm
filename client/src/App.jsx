import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminRoute from "./routes/AdminRoute.jsx";
import StaffRoute from "./routes/StaffRoute.jsx";

import AdminLayout from "./layout/AdminLayout.jsx";

// Admin pages
import MovieManagement from "./pages/Admin/Movie/MovieManagement.jsx";
import RoomManagement from "./pages/Admin/Rooms/RoomManagement.jsx";
import ShowtimesPage from "./pages/Admin/Showtimes/ShowtimesPage.jsx";
import RevenueReport from "./pages/Admin/Reports/RevenueReport.jsx";
import UserManagement from "./pages/Admin/Users/UserManagement.jsx";
import PromotionManagement from "./pages/Admin/Promotions/PromotionManagement.jsx";
import FoodManagement from "./pages/Admin/Foods/FoodManagement.jsx";

// Staff pages
import CheckInPage from "./pages/Staff/Checkin/CheckinPage.jsx";
import TicketSalesPage from "./pages/Staff/Sale/TicketSalesPage.jsx";

// Admin+Staff pages
import Dashboard from "./pages/Admin/Dashboard.jsx";

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
          <Route path="sale" element={<TicketSalesPage />} />
          {/* <Route path="sale" element={<CounterBookingPage />} /> */}

          {/* ===== ADMIN ONLY ===== */}
          <Route
            path="foods"
            element={
              <AdminRoute>
                <FoodManagement />
              </AdminRoute>
            }
          />

          <Route
            path="movie-management"
            element={
              <AdminRoute>
                <MovieManagement />
              </AdminRoute>
            }
          />

          <Route
            path="promotions"
            element={
              <AdminRoute>
                <PromotionManagement />
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
