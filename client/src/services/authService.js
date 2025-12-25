// client/src/services/authService.js
import axios from "axios";

// Đảm bảo URL này đúng với port server của bạn (5000)
const API_URL = "http://localhost:5000/auth"; 

// Cấu hình axios gửi cookie (quan trọng để nhận refreshToken)
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

const authService = {
  // Feature 1: Đăng ký
  register: async (userData) => {
    try {
      // Input: fullName, email, password
      const response = await axiosInstance.post("/register", userData);
      return response.data;
    } catch (error) {
      // Scenario 2: Trả về lỗi nếu email trùng
      throw error.response?.data || error.message;
    }
  },

  // Feature 2: Đăng nhập
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post("/login", { email, password });
      // Expected: accessToken, user info
      if (response.data.accessToken) {
        // Lưu accessToken vào localStorage để dùng cho các request sau
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      // Scenario 2: Sai mật khẩu
      throw error.response?.data || error.message;
    }
  },

  logout: async () => {
    try {
        await axiosInstance.post("/logout");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
    } catch (error) {
        console.error(error);
    }
  }
};

export default authService;