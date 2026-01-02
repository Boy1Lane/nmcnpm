import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Button, theme } from 'antd';
import { LoginOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const {
    token: { colorBgContainer, colorTextLightSolid },
  } = theme.useToken();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <AntHeader
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        height: '72px', // Tăng chiều cao
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        padding: '0 5%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #f0f0f0'
      }}
    >
      <div className="logo">
        <Link
          to="/"
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#e50914', // Netflix Red
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🎬 CinemaVerse
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {token ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              type="text"
              style={{ color: '#000000' }}
              icon={<UserOutlined />}
              onClick={() => navigate('/profile')}
            >
              Tài khoản
            </Button>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </div>
        ) : (
          <Link to="/login">
            <Button type="primary" style={{ backgroundColor: '#e50914' }} icon={<LoginOutlined />}>
              Đăng nhập
            </Button>
          </Link>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;
