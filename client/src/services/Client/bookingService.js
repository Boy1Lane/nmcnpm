import axiosClient from '../axiosClient';

const bookingService = {
    // 1. Lấy sơ đồ ghế và trạng thái (Available/Sold) của 1 suất chiếu
    getSeatsByShowtime: async (showtimeId) => {
        const response = await axiosClient.get(`/api/showtimes/${showtimeId}/seats`);
        return response.data;
    },

    // 2. Lấy danh sách các gói Combo Bắp & Nước
    getFoods: async () => {
        const response = await axiosClient.get('/api/foods');
        return response.data;
    },

    // 3. Gửi đơn đặt vé cuối cùng lên Server
    createBooking: async (bookingData) => {
        // bookingData bao gồm: showtimeId, seats[], foods[], paymentMethod
        const response = await axiosClient.post('/api/bookings', bookingData);
        return response.data;
    }
};

export default bookingService;