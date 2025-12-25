import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import './ClientLayout.css'; // Chúng ta sẽ thêm CSS bên dưới

const ClientLayout = () => {
  const navigate = useNavigate();
  // Kiểm tra xem user đã đăng nhập chưa (lấy từ localStorage lúc login)
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="client-layout">
      {/* HEADER */}
      <header className="client-header">
        <div className="logo">
          <Link to="/">🎬 CinemaVerse</Link>
        </div>
        <nav className="nav-menu">
          <Link to="/">Phim đang chiếu</Link>
          <Link to="/">Lịch chiếu</Link>
          <Link to="/">Tin tức</Link>
        </nav>
        <div className="auth-buttons">
          {user ? (
            <div className="user-info">
              <span>Xin chào, {user.fullName}</span>
              <button onClick={handleLogout} className="btn-logout">Đăng xuất</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-login">Đăng nhập</Link>
              <Link to="/register" className="btn-register">Đăng ký</Link>
            </>
          )}
        </div>
      </header>

      {/* NỘI DUNG CHÍNH (Homepage sẽ hiện ở đây) */}
      <main className="client-content">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="client-footer">
        <p>&copy; 2025 CinemaVerse - Đồ án NMCNPM - HCMUS</p>
      </footer>
    </div>
  );
};

export default ClientLayout;