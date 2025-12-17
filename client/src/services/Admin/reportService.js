import axiosAdmin from "./axiosAdmin";

const reportService = {
  // BOOKINGS (đã có seats)
  getBookings() {
    return axiosAdmin.get("/bookings");
  },

  // SHOWTIMES (có movieId, roomId)
  getShowtimes() {
    return axiosAdmin.get("/showtimes");
  },

  // ROOMS (có cinemaId)
  getRooms() {
    return axiosAdmin.get("/rooms");
  },

  // CINEMAS
  getCinemas() {
    return axiosAdmin.get("/cinemas");
  },

  // MOVIES
  getMovies() {
    return axiosAdmin.get("/movies");
  },
};

export default reportService;
