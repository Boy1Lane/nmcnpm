import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import './ClientLayout.css'; // Đảm bảo bạn đã tạo file CSS này ở bước trước

const ClientLayout = () => {
  const navigate = useNavigate();

  // --- HÀM LẤY USER AN TOÀN (FIX LỖI TRẮNG MÀN HÌNH) ---
  // Dùng try-catch để nếu dữ liệu trong localStorage bị lỗi, web không bị sập
  const getUser = () => {
    try {
      const savedUser = localStorage.getItem('user');
      // Kiểm tra nếu có dữ liệu và không phải là chuỗi "undefined"
      if (savedUser && savedUser !== "undefined") {
        return JSON.parse(savedUser);
      }
      return null;
    } catch (error) {
      console.error("Dữ liệu user bị lỗi, tự động reset:", error);
      // Nếu lỗi JSON, xóa luôn để lần sau không bị lại
      localStorage.removeItem('user'); 
      return null;
    }
  };

  const user = getUser();

  const handleLogout = () => {
    // Xóa token và thông tin user khi đăng xuất
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    // Chuyển hướng về trang đăng nhập
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
            <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Hiển thị tên user, ưu tiên fullName, nếu không có thì dùng username */}
              <span>Xin chào, {user.fullName || user.username || "Khách hàng"}</span>
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