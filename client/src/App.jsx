import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout'; 

// Client Pages
import HomePage from './pages/Client/HomePage';
import LoginPage from './pages/Client/LoginPage';
import RegisterPage from './pages/Client/RegisterPage'; // 🛑 THÊM DÒNG NÀY

// --- Hàm kiểm tra Role ---
const isAuthenticated = () => {
  return localStorage.getItem('accessToken') !== null;
};

const isAdmin = () => {
  return localStorage.getItem('userRole') === 'admin';
};

// Component bảo vệ tuyến đường Admin
const AdminProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* --- Tuyến đường Client (Có Layout) --- */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} /> {/* 🛑 THÊM DÒNG NÀY */}
          {/* Sẽ thêm các routes chi tiết phim */}
        </Route>

        {/* --- Tuyến đường Admin (Bảo vệ và có Layout) --- */}
        <Route 
          path="/admin" 
          element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>} 
        >
          <Route path="movies" element={<h1>Admin Movie Management (Placeholder)</h1>} />
          {/* Sẽ thêm các routes Admin khác */}
        </Route>

        {/* --- Tuyến đường Không tìm thấy (404) --- */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;