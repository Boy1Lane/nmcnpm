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
};

export default bookingService;
