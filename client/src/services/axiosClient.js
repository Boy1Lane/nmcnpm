import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // ⭐ để gửi refreshToken cookie
});

// ================= REQUEST =================
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ================= RESPONSE (AUTO REFRESH) =================
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // accessToken hết hạn
     if (
      (error.response?.status === 401 ||
    error.response?.status === 403) &&
  !originalRequest._retry &&
  !originalRequest.url.includes("/auth/")
    ) {
      originalRequest._retry = true;

      try {
        // 🔥 GỌI API REFRESH THEO ĐÚNG BE CỦA BẠN
        const refreshRes = await axios.post(
          "http://localhost:5000/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshRes.data.accessToken;

        // lưu token mới
        localStorage.setItem("accessToken", newAccessToken);

        // gắn lại token cho request cũ
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        // gọi lại request ban đầu
        return axiosClient(originalRequest);
      } catch (err) {
        // refresh token hết hạn → logout
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
