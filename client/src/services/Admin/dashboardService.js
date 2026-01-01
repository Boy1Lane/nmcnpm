import axiosAdmin from "./axiosAdmin";

const dashboardService = {
  // phim đang chiếu
  getMovies() {
    return axiosAdmin.get("/movies");
  },

  // suất chiếu hôm nay
  getShowtimesByDate(date) {
    return axiosAdmin.get(`/showtimes?date=${date}`);
  },

  // vé + doanh thu hôm nay (API MỚI)
  getTodayStats() {
    return axiosAdmin.get("/dashboard/today");
  },
};

export default dashboardService;
