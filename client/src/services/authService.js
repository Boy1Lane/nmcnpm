import axios from "axios";

// Tạo một instance riêng cho Auth vì file authRoute nằm ngoài thư mục api ở Server
const authAxios = axios.create({
  baseURL: "http://localhost:5000", // Không có /api ở đây
  withCredentials: true, // Bắt buộc để gửi/nhận cookie
});

// Thêm Interceptor để tự động gắn Token vào Header
authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const authService = {
  // Kết quả gọi: http://localhost:5000/auth/login
  login: (data) => authAxios.post("/auth/login", data),

  // Kết quả gọi: http://localhost:5000/auth/register
  register: (data) => authAxios.post("/auth/register", data),

  resetPassword: (token, password) => {
    return authAxios.post('/auth/reset-password', { token, password });
  },
  getProfile: () => {
    return authAxios.get('/auth/me');
  },

  logout: () => authAxios.post("/auth/logout"),
};

export default authService;