import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminRoute from "./routes/AdminRoute.jsx";
import StaffRoute from "./routes/StaffRoute.jsx";
import ClientRoute from "./routes/ClientRoute.jsx"; // Route bảo vệ cho khách

import AdminLayout from "./layout/AdminLayout.jsx";
import ClientLayout from "./layout/ClientLayout.jsx"; // Layout cho khách

// Admin pages
import Dashboard from "./pages/Admin/Dashboard.jsx";
import MovieManagement from "./pages/Admin/Movie/MovieManagement.jsx";
import RoomManagement from "./pages/Admin/Rooms/RoomManagement.jsx";
import ShowtimesPage from "./pages/Admin/Showtimes/ShowtimesPage.jsx";
import RevenueReport from "./pages/Admin/Reports/RevenueReport.jsx";
import UserManagement from "./pages/Admin/Users/UserManagement.jsx";
import PromotionManagement from "./pages/Admin/Promotions/PromotionManagement.jsx";

// Staff pages
import CheckInPage from "./pages/Staff/Checkin/CheckinPage.jsx";

// Client pages (Các file bạn vừa copy)
import HomePage from "./pages/Client/HomePage.jsx";
import MovieDetail from "./pages/Client/MovieDetail.jsx";
import BookingPage from "./pages/Client/BookingPage.jsx";
import ConcessionsPage from "./pages/Client/ConcessionsPage.jsx";
import PaymentPage from "./pages/Client/PaymentPage.jsx";
import TicketSuccess from "./pages/Client/TicketSuccess.jsx";

// Auth pages
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ===== AUTHENTICATION ===== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ===== CLIENT ROUTES (DÀNH CHO KHÁCH HÀNG) ===== */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<HomePage />} />
          <Route path="movie/:id" element={<MovieDetail />} />
          
          {/* Bắt buộc đăng nhập mới được vào luồng đặt vé */}
          <Route element={<ClientRoute />}>
            <Route path="booking/:scheduleId" element={<BookingPage />} />
            <Route path="booking/:scheduleId/concessions" element={<ConcessionsPage />} />
            <Route path="payment/:scheduleId" element={<PaymentPage />} />
            <Route path="ticket-success" element={<TicketSuccess />} />
          </Route>
        </Route>

        {/* ===== ADMIN + STAFF (KHUNG QUẢN TRỊ) ===== */}
        <Route
          path="/admin"
          element={
            <StaffRoute>
              <AdminLayout />
            </StaffRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="check-in" element={<CheckInPage />} />

          {/* ADMIN ONLY ROUTES */}
          <Route element={<AdminRoute />}>
            <Route path="movie-management" element={<MovieManagement />} />
            <Route path="promotions" element={<PromotionManagement />} />
            <Route path="room-seat" element={<RoomManagement />} />
            <Route path="showtimes" element={<ShowtimesPage />} />
            <Route path="report" element={<RevenueReport />} />
            <Route path="user" element={<UserManagement />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}