import axiosClient from '../axiosClient';

const bookingService = {
  // Lấy danh sách ghế của suất chiếu (Sử dụng ShowtimeSeat)
  getSeatsByShowtime: async (showtimeId) => {
    const response = await axiosClient.get(`/api/showtimes/${showtimeId}/seats`);
    return response.data;
  },
  // Bước 1: Giữ ghế (Tạo Booking PENDING và LOCKED ghế)
  createBooking: async (showtimeId, seatIds, paymentMethod = 'CASH') => {
    const response = await axiosClient.post('/api/bookings', { 
      showtimeId, 
      seatIds, 
      paymentMethod 
    });
    return response.data;
  },
  // Bước 2: Xác nhận thanh toán (Chuyển sang CONFIRMED)
  confirmBooking: async (bookingId) => {
    const response = await axiosClient.post('/api/bookings/confirm', { bookingId });
    return response.data;
  }
};
export default bookingService;