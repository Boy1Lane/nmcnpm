import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Xử lý khi nhập liệu
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Xóa lỗi khi người dùng bắt đầu gõ lại
    setError('');
  };

  // Xử lý khi bấm nút Đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Kiểm tra mật khẩu trùng khớp
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      // Gọi API đăng ký
      await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });

      setSuccess("Đăng ký thành công! Đang chuyển trang...");
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      // 2. HIỆN LỖI CỤ THỂ TỪ SERVER (QUAN TRỌNG)
      // Nếu server trả về message (ví dụ: "Email đã tồn tại"), ta lấy nó ra
      const serverMessage = err.response && err.response.data && err.response.data.message;
      setError(serverMessage || "Đăng ký thất bại. Vui lòng thử lại!");
    }
  };

  // --- STYLE GIAO DIỆN (ĐEN - ĐỎ) ---
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#1a1a1a', // Nền đen xám
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    },
    formBox: {
      backgroundColor: '#000', // Hộp đen tuyền
      padding: '40px',
      borderRadius: '8px',
      width: '400px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
      textAlign: 'center'
    },
    input: {
      width: '100%',
      padding: '12px',
      margin: '10px 0',
      borderRadius: '4px',
      border: '1px solid #333',
      backgroundColor: '#222', // Ô nhập màu tối
      color: 'white',
      boxSizing: 'border-box' // Để padding không làm vỡ khung
    },
    button: {
      width: '100%',
      padding: '12px',
      marginTop: '20px',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#d32f2f', // NÚT MÀU ĐỎ
      color: 'white',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '16px'
    },
    errorMsg: {
      color: '#ff6b6b', // Chữ báo lỗi màu đỏ sáng
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
      padding: '10px',
      borderRadius: '4px',
      marginTop: '10px',
      border: '1px solid #ff6b6b'
    },
    successMsg: {
      color: '#4caf50',
      marginBottom: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={{ marginBottom: '20px' }}>Đăng Ký Thành Viên</h2>

        {error && <div style={styles.errorMsg}>{error}</div>}
        {success && <div style={styles.successMsg}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            name="fullName"
            placeholder="Họ và tên"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="password"
            name="confirmPassword"
            placeholder="Nhập lại mật khẩu"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" style={styles.button}>
            Đăng Ký
          </button>
        </form>

        <p style={{ marginTop: '20px', color: '#888' }}>
          Đã có tài khoản? <Link to="/login" style={{ color: '#d32f2f', textDecoration: 'none' }}>Đăng nhập ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;