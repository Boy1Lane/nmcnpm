import axios from 'axios';

// Đảm bảo port 5000 là đúng port server của bạn
const API_URL = "http://localhost:5000/api/auth"; 

// 1. Đăng ký
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// 2. Đăng nhập
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  if (response.data) {
    // Lưu thông tin user kèm token vào bộ nhớ trình duyệt
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// 3. Đăng xuất
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;