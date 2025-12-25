import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Gọi API đăng nhập
      const data = await authService.login(email, password);
      
      // Kiểm tra Role để điều hướng
      if (data.user.role === 'admin' || data.user.role === 'staff') {
         navigate('/admin'); 
      } else {
         navigate('/'); // Khách hàng về trang chủ
      }

    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-card">
        <h2 className="login-title">Đăng Nhập</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input 
                type="email" 
                className="form-input" 
                placeholder="Email hoặc số điện thoại"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input 
                type="password" 
                className="form-input" 
                placeholder="Mật khẩu"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
            />
          </div>

          <button type="submit" className="login-btn">Đăng Nhập</button>
        </form>

        <p style={{marginTop: '15px', textAlign: 'center', color: '#ccc'}}>
          Chưa có tài khoản? <Link to="/register" style={{color: '#e50914'}}>Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;