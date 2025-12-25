import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import './Login.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Kiểm tra mật khẩu nhập lại
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      console.log("Đang gửi dữ liệu đăng ký:", formData); // Log xem dữ liệu gửi đi
      
      // Gọi API đăng ký
      await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      
      // Thông báo và chuyển trang
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate('/login');
      
    } catch (err) {
      // --- PHẦN QUAN TRỌNG ĐỂ TÌM LỖI ---
      console.error("Lỗi chi tiết:", err); // Xem lỗi đỏ trong tab Console (F12)

      // Xử lý để lấy message chuẩn nhất
      let errorMessage = "Đăng ký thất bại";
      
      if (err && err.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else {
        errorMessage = JSON.stringify(err);
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-card">
        <h2 className="login-title">Đăng Ký Thành Viên</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ và tên</label>
            <input 
                type="text" 
                name="fullName" 
                className="form-input" 
                placeholder="Họ và tên của bạn"
                value={formData.fullName} 
                onChange={handleChange} 
                required 
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
                type="email" 
                name="email" 
                className="form-input" 
                placeholder="Email (Ví dụ: name@gmail.com)"
                value={formData.email} 
                onChange={handleChange} 
                required 
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input 
                type="password" 
                name="password" 
                className="form-input" 
                placeholder="Mật khẩu (Ít nhất 6 ký tự)"
                value={formData.password} 
                onChange={handleChange} 
                required 
            />
          </div>
          <div className="form-group">
            <label>Nhập lại mật khẩu</label>
            <input 
                type="password" 
                name="confirmPassword" 
                className="form-input" 
                placeholder="Nhập lại mật khẩu trên"
                value={formData.confirmPassword} 
                onChange={handleChange} 
                required 
            />
          </div>

          <button type="submit" className="login-btn">Đăng Ký</button>
        </form>
        
        <p style={{marginTop: '15px', textAlign: 'center', color: '#ccc'}}>
          Đã có tài khoản? <Link to="/login" style={{color: '#e50914'}}>Đăng nhập ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;