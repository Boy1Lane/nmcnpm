import axiosClient from '../axiosClient';

const bookingService = {
  // Lấy danh sách ghế của suất chiếu (Sử dụng ShowtimeSeat)
  getSeatsByShowtime: async (showtimeId) => {
    const response = await axiosClient.get(`/showtimes/${showtimeId}/seats`);
    return response.data;
  },

  // Lấy danh sách đồ ăn
  getFoods: async () => {
    const response = await axiosClient.get('/foods'); // Giả sử route là /api/foods
    return response.data;
  },

  // Kiểm tra mã khuyến mãi
  checkPromotion: async (code) => {
    const response = await axiosClient.post('/promotions/check', { code });
    return response.data;
  },

  // Bước 1: Giữ ghế (Tạo Booking PENDING và LOCKED ghế)
  createBooking: async (showtimeId, seatIds, paymentMethod = 'CASH', foodItems = [], promotionCode = null) => {
    const response = await axiosClient.post('/bookings', {
      showtimeId,
      seatIds,
      paymentMethod,
      foodItems,
      promotionCode
    });
    return response.data;
  },
  // Bước 2: Xác nhận thanh toán (Chuyển sang CONFIRMED)
  confirmBooking: async (bookingId) => {
    const response = await axiosClient.post('/bookings/confirm', { bookingId });
    return response.data;
  },

  getMyBookings: async () => {
    const response = await axiosClient.get('/bookings/my-bookings');
    return response.data;
  },

  cancelBooking: async (bookingId) => {
    const response = await axiosClient.post(`/bookings/${bookingId}/cancel`);
    return response.data;
  }
};
export default bookingService;