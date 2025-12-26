import axiosClient from "./axiosClient";

const authService = {
  login: (data) => axiosClient.post("/auth/login", data),
  register: (data) => axiosClient.post("/auth/register", data),
  logout: () => axiosClient.post("/auth/logout"),
};

export default authService;
