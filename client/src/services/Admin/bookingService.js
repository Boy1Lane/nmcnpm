import axiosAdmin from "./axiosAdmin";

const bookingService = {
  // 🔹 Lấy booking theo ID (phục vụ check-in)
  getBookingById(id) {
    return axiosAdmin.get(`/bookings/${id}`);
  },

  // 🔹 Soát vé: CONFIRMED → USED
  checkInBooking(id) {
    return axiosAdmin.put(`/bookings/${id}`, {
      status: "USED",
    });
  },
  create(payload) {
    return axiosAdmin
      .post("/bookings", payload)
      .then((res) => ({ success: true, data: res.data }))
      .catch((err) => ({
        success: false,
        error: err.response?.data?.message || "Booking failed",
      }));
  },

};

export default bookingService;
