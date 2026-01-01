import axiosAdmin from "./axiosAdmin";

const ticketSaleService = {
  /* ================= MOVIE ================= */
  getMovies() {
    return axiosAdmin.get("/movies");
  },

  getMovie(id) {
    return axiosAdmin.get(`/movies/${id}`);
  },

  /* ================= SHOWTIME ================= */
  getShowtimes(date) {
    return axiosAdmin.get("/showtimes", {
      params: date ? { date } : {}
    });
  },

  getShowtimesByMovie(movieId) {
    // FE filter vì BE chưa có endpoint riêng
    return axiosAdmin.get("/showtimes").then(res =>
      res.data.filter(st => st.movie?.id === movieId)
    );
  },

  getShowtimeSeats(showtimeId) {
    return axiosAdmin.get(`/showtimes/${showtimeId}/seats`);
  },

  /* ================= CINEMA ================= */
  getCinemas() {
    return axiosAdmin.get("/cinemas");
  },

  /* ================= FOOD ================= */
  getFoods() {
    return axiosAdmin.get("/foods");
  },

  /* ================= BOOKING ================= */
 createBooking({ userId, showtimeId, seatIds }) {
  return axiosAdmin.post("/bookings", {
    userId,
    showtimeId,
    seatIds,
  });
},


  getBooking(bookingId) {
    return axiosAdmin.get(`/bookings/${bookingId}`);
  },

  confirmBooking(bookingId, data = {}) {
    // Server expects POST /admin/bookings/confirm with { bookingId }
    return axiosAdmin.post('/bookings/confirm', { bookingId, ...data });
  },


  cancelBooking(bookingId) {
    return axiosAdmin.post(`/bookings/${bookingId}/cancel`);
  },

  /* ================= BOOKING - SEAT ================= */
  addSeats(bookingId, showtimeSeatIds) {
    return axiosAdmin.post(`/bookings/${bookingId}/seats`, {
      seatIds: showtimeSeatIds
    });
  },

  removeSeat(bookingId, showtimeSeatId) {
    return axiosAdmin.delete(
      `/bookings/${bookingId}/seats/${showtimeSeatId}`
    );
  },

  /* ================= BOOKING - FOOD ================= */
  addFoods(bookingId, foodCombos) {
    // Accepts either array of ids (legacy) or array of { foodComboId, quantity }
    return axiosAdmin.post(`/bookings/${bookingId}/foods`, {
      foodCombos,
    });
  },

  removeFood(bookingId, foodComboId) {
    return axiosAdmin.delete(
      `/bookings/${bookingId}/foods/${foodComboId}`
    );
  },
  getRoomSeats(roomId) {
    return axiosAdmin.get(`/rooms/${roomId}/seats`);
  },
  applyPromotion(data) {
    return axiosAdmin.post("/promotions/apply", data);
  },
};

export default ticketSaleService;
