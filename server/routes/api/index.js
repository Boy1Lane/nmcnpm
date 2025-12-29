const router = require('express').Router();

const showtimeRoutes = require('./showtimeRoute.js');
const userRoutes = require('./userRoute.js');

const clientBookingRoutes = require('../client/bookingRoute.js'); 
const clientMovieRoutes = require('../client/movieRoute.js'); // Xử lý hiển thị phim trang chủ
const clientFoodRoutes = require('../client/foodRoute.js');   // Xử lý lấy danh sách bắp nước


router.use('/movies', clientMovieRoutes);

// Route Bắp nước: Mới thêm để trang Concessions gọi API
router.use('/foods', clientFoodRoutes);

// Route Đặt vé: Để lưu đơn hàng
router.use('/bookings', clientBookingRoutes);

// Các route khác giữ nguyên
router.use('/showtimes', showtimeRoutes);
router.use('/users', userRoutes);

module.exports = router;