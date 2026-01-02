import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Client/Header'; // Bạn sẽ tạo Header cho Client
import './ClientLayout.css';

const ClientLayout = () => {
  return (
    <div className="client-layout">
      {/* Header dành riêng cho người mua vé */}
      <Header />

      <main className="client-content">
        {/* Outlet là nơi nội dung của HomePage, BookingPage sẽ hiển thị */}
        <Outlet />
      </main>
    </div>
  );
};

export default ClientLayout;