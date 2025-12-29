import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header style={{ padding: '15px 5%', background: '#000', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e50914', position: 'sticky', top: 0, zIndex: 1000 }}>
      <Link to="/" style={{ fontSize: '28px', fontWeight: 'bold', color: '#e50914', textDecoration: 'none' }}>CinemaVerse</Link>
      <nav style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Trang chủ</Link>
        {token ? (
          <button onClick={handleLogout} style={{ background: '#e50914', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>Đăng xuất</button>
        ) : (
          <Link to="/login" style={{ background: '#e50914', color: '#fff', padding: '8px 20px', borderRadius: '4px', textDecoration: 'none' }}>Đăng nhập</Link>
        )}
      </nav>
    </header>
  );
};
export default Header;