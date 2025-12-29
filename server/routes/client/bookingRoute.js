const express = require('express');
const router = express.Router();
const bookingController = require('../../controllers/client/bookingController');
const verifyToken = require('../../middleware/verifyToken'); // Đảm bảo bạn đã có middleware này

// 1. Lấy ghế của suất chiếu (Ai cũng xem được)
// URL: /api/bookings/showtime/:showtimeId/seats
router.get('/showtime/:showtimeId/seats', bookingController.getSeatsByShowtime);

// 2. Đặt vé (Phải đăng nhập mới được đặt)
// URL: /api/bookings
router.post('/', verifyToken, bookingController.createBooking);

module.exports = router;