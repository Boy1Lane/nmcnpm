import axios from '../api/axiosInstance'; // Đảm bảo bạn đã có axiosInstance cấu hình base URL

const bookingService = {
  // 1. Lấy sơ đồ ghế của suất chiếu (GET)
  getSeatsByShowtime: async (showtimeId) => {
    const response = await axios.get(`/bookings/showtime/${showtimeId}/seats`);
    return response.data;
  },

  // 2. Tạo đơn đặt vé (POST)
  // Payload gồm: { showtimeId, seats: [], foods: [], paymentMethod }
  createBooking: async (bookingData) => {
    const response = await axios.post('/bookings', bookingData);
    return response.data;
  },

  // 3. Lấy danh sách Combo bắp nước (Nếu bạn làm thêm API này sau)
  getFoods: async () => {
    const response = await axios.get('/foods'); // Gọi API Backend
    return response.data;
  }
};

export default bookingService;