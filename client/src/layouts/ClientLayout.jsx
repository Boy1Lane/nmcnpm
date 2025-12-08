import React from 'react';
import { Layout, Menu, theme, Button } from 'antd';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const ClientLayout = () => {
  const navigate = useNavigate();
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const menuItems = [
    { key: '/', label: <Link to="/">Trang Chủ</Link> },
  ];

  if (userRole === 'admin') {
    menuItems.push({ key: '/admin/movies', label: <Link to="/admin/movies">Quản Lý Phim</Link> });
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
        <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
          CinemaVerse
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['/']}
            items={menuItems}
            style={{ flex: 1, minWidth: 0, borderBottom: 'none' }}
          />
          {userRole ? (
            <Button onClick={handleLogout} type="default" style={{ marginLeft: 20 }}>
              Đăng Xuất ({userRole})
            </Button>
          ) : (
            <> 
              <Link to="/login">
                <Button type="primary" style={{ marginLeft: 10 }}>
                  Đăng Nhập
                </Button>
              </Link>
              <Link to="/register">
                <Button type="default" style={{ marginLeft: 10 }}>
                  Đăng Ký
                </Button>
              </Link>
            </>
          )}
        </div>
      </Header>
      <Content style={{ padding: '0 48px' }}>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
            marginTop: 20,
          }}
        >
          {}
          <Outlet />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        CinemaVerse ©{new Date().getFullYear()} Created by Group XYZ
      </Footer>
    </Layout>
  );
};

export default ClientLayout;