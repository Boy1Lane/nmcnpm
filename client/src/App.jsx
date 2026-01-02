import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminRoute from "./routes/AdminRoute.jsx";
import StaffRoute from "./routes/StaffRoute.jsx";

import AdminLayout from "./layout/AdminLayout.jsx";
import ClientLayout from "./layout/ClientLayout.jsx";

// ===== ADMIN PAGES =====
import MovieManagement from "./pages/Admin/Movie/MovieManagement.jsx";
import RoomManagement from "./pages/Admin/Rooms/RoomManagement.jsx";
import ShowtimesPage from "./pages/Admin/Showtimes/ShowtimesPage.jsx";
import RevenueReport from "./pages/Admin/Reports/RevenueReport.jsx";
import UserManagement from "./pages/Admin/Users/UserManagement.jsx";
import PromotionManagement from "./pages/Admin/Promotions/PromotionManagement.jsx";
import FoodManagement from "./pages/Admin/Foods/FoodManagement.jsx";

// ===== STAFF PAGES =====
import CheckInPage from "./pages/Staff/Checkin/CheckinPage.jsx";
import TicketSalesPage from "./pages/Staff/Sale/TicketSalesPage.jsx";

// ===== SHARED =====
import Dashboard from "./pages/Admin/Dashboard.jsx";

// ===== CLIENT PAGES =====
import HomePage from "./pages/Client/HomePage.jsx";
import MovieDetail from "./pages/Client/MovieDetail.jsx";
import BookingPage from "./pages/Client/BookingPage.jsx";
import ConcessionsPage from "./pages/Client/ConcessionsPage.jsx";
import PaymentPage from "./pages/Client/PaymentPage.jsx";
import TicketSuccess from "./pages/Client/TicketSuccess.jsx";
import ProfilePage from "./pages/Client/ProfilePage.jsx";

// ===== AUTH =====
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage.jsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";

import { GoogleOAuthProvider } from "@react-oauth/google";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
console.log("App.jsx - Google Client ID:", GOOGLE_CLIENT_ID);

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Routes>
          {/* ===== PUBLIC AUTH ===== */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* ===== CLIENT ===== */}
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<HomePage />} />
            <Route path="movie/:id" element={<MovieDetail />} />
            <Route path="booking/:scheduleId" element={<BookingPage />} />
            <Route
              path="concessions/:scheduleId"
              element={<ConcessionsPage />}
            />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="ticket-success" element={<TicketSuccess />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* ===== STAFF ===== */}
          <Route
            path="/admin"
            element={
              <StaffRoute>
                <AdminLayout />
              </StaffRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="check-in" element={<CheckInPage />} />
            <Route path="sale" element={<TicketSalesPage />} />
          </Route>

          {/* ===== ADMIN ===== */}
          <Route
            path="/admin"
            element={
              <StaffRoute>
                <AdminLayout />
              </StaffRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />

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
    </GoogleOAuthProvider>
  );
}
