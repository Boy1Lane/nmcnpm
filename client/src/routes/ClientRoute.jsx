import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ClientRoute = () => {
    // Kiểm tra token trong localStorage (giống cách bạn làm ở Login)
    const token = localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('userRole');

    // Nếu không có token, đẩy về trang login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Nếu có token nhưng role là admin/staff, bạn có thể cho qua hoặc 
    // giữ nguyên để họ vẫn có thể mua vé như khách hàng bình thường.
    return <Outlet />;
};

export default ClientRoute;