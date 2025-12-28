import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Layouts
import ClientLayout from './layout/ClientLayout';
import AdminLayout from './layout/AdminLayout';

// 2. Auth Pages
// (SỬA: Trỏ đúng vào thư mục Auth đang nằm ngoài)
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// 3. Client Pages
import HomePage from './pages/Client/HomePage';
import MovieDetail from './pages/Client/MovieDetail';
import BookingPage from './pages/Client/BookingPage';
import ConcessionsPage from './pages/Client/ConcessionsPage';
import PaymentPage from './pages/Client/PaymentPage';
import TicketSuccess from './pages/Client/TicketSuccess';

// 4. Admin Pages
// (SỬA: Nếu Dashboard là thư mục, bạn cần trỏ vào file bên trong nó. 
// Nếu Dashboard.jsx nằm ngay trong pages, dòng dưới sẽ chạy)
import Dashboard from './pages/Dashboard/Dashboard'; 
// Hoặc nếu file tên là Dashboard.jsx nằm ngoài thì dùng: './pages/Dashboard'

// Các trang quản lý khác (Giả sử vẫn nằm trong Admin hoặc Movies)
import MovieManagement from './pages/Admin/MovieManagement'; // Kiểm tra lại file này
import RoomManagement from './pages/Admin/Rooms/RoomManagement';
import ShowtimesPage from './pages/Admin/Showtimes/ShowtimesPage';
import RevenueReport from './pages/Admin/Reports/RevenueReport';

const App = () => {
  return (
    <Router>
      <Routes>
        
        {/* --- AUTHENTICATION --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- CLIENT (KHÁCH HÀNG) --- */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<HomePage />} />
          <Route path="movie/:id" element={<MovieDetail />} />
          
          <Route path="booking/:scheduleId" element={<BookingPage />} />
          <Route path="booking/:scheduleId/concessions" element={<ConcessionsPage />} />
          <Route path="booking/:scheduleId/payment" element={<PaymentPage />} />
          <Route path="ticket-success" element={<TicketSuccess />} />
        </Route>

        {/* --- ADMIN (QUẢN TRỊ) --- */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          <Route path="movie-management" element={<MovieManagement />} />
          <Route path="room-seat" element={<RoomManagement />} />
          <Route path="showtimes" element={<ShowtimesPage />} />
          <Route path="report" element={<RevenueReport />} />
        </Route>

        {/* --- 404 --- */}
        <Route path="*" element={<h1>404 - Trang không tồn tại</h1>} />

      </Routes>
    </Router>
  );
};

export default App;