import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminRoute from "./routes/AdminRoute.jsx";
import StaffRoute from "./routes/StaffRoute.jsx";

import AdminLayout from "./layout/AdminLayout.jsx";
import ClientLayout from "./layout/ClientLayout.jsx";

// Admin pages
import Dashboard from "./pages/Admin/Dashboard.jsx";
import MovieManagement from "./pages/Admin/Movie/MovieManagement.jsx";
import RoomManagement from "./pages/Admin/Rooms/RoomManagement.jsx";
import ShowtimesPage from "./pages/Admin/Showtimes/ShowtimesPage.jsx";
import RevenueReport from "./pages/Admin/Reports/RevenueReport.jsx";
import UserManagement from "./pages/Admin/Users/UserManagement.jsx";
import PromotionManagement from "./pages/Admin/Promotions/PromotionManagement.jsx";
import FoodManagement from "./pages/Admin/Foods/FoodManagement.jsx";

// Staff pages
import CheckInPage from "./pages/Staff/Checkin/CheckinPage.jsx";

// Client pages
import HomePage from "./pages/Client/HomePage.jsx";
import MovieDetail from "./pages/Client/MovieDetail.jsx";
import BookingPage from "./pages/Client/BookingPage.jsx";
import ConcessionsPage from "./pages/Client/ConcessionsPage.jsx";
import PaymentPage from "./pages/Client/PaymentPage.jsx";
import TicketSuccess from "./pages/Client/TicketSuccess.jsx";

// Auth pages
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import ProfilePage from "./pages/Client/ProfilePage.jsx";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"; // Thay bằng Client ID thật

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ===== PUBLIC AUTH ===== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ===== CLIENT (CUSTOMER) ===== */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<HomePage />} />
          <Route path="movie/:id" element={<MovieDetail />} />
          <Route path="booking/:scheduleId" element={<BookingPage />} />
          <Route path="concessions/:scheduleId" element={<ConcessionsPage />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="ticket-success" element={<TicketSuccess />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* ===== ADMIN + STAFF (PRIVATE) ===== */}
        <Route
          path="/admin"
          element={
            <StaffRoute>
              <AdminLayout />
            </StaffRoute>
          }
        >
          {/* STAFF + ADMIN ACCESSIBLE */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="check-in" element={<CheckInPage />} />
          {/* <Route path="sale" element={<CounterBookingPage />} /> */}

          {/* ADMIN ONLY */}
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