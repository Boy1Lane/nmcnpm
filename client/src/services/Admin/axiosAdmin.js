import axios from "axios";

const axiosAdmin = axios.create({
  baseURL: "http://localhost:5000/admin",
  headers: {
    "Content-Type": "application/json",
  },
});

// tự gắn token admin
axiosAdmin.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosAdmin;
