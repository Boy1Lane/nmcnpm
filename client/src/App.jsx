import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import ClientLayout from './layout/ClientLayout';
// import AdminLayout from './layout/AdminLayout'; 

// Pages
import HomePage from './pages/Client/HomePage';
import LoginPage from './pages/Auth/Login';       
import RegisterPage from './pages/Auth/Register'; 

const App = () => {
  return (
    <Router>
      <Routes>
        {/* --- NHÓM 1: CÁC TRANG CÓ HEADER/FOOTER (Màu trắng) --- */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<HomePage />} />
          {/* Các trang xem phim, đặt vé sẽ nằm ở đây */}
        </Route>

        {/* --- NHÓM 2: CÁC TRANG ĐỨNG RIÊNG (Giao diện Đen/Đỏ cũ) --- */}
        {/* Đặt nó ra ngoài Route của ClientLayout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 404 */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;