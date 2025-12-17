const express = require('express');
const router = express.Router();
const bookingController = require('../../controllers/user/bookingController');
const verifyToken = require('../../middlewares/authMiddleware');

// POST /api/bookings -> createBooking (Hold seats)
router.post('/', verifyToken, bookingController.createBooking);

// POST /api/bookings/confirm -> confirmBooking
router.post('/confirm', verifyToken, bookingController.confirmBooking);

// GET /api/bookings/my-bookings -> getUserBookings
router.get('/my-bookings', verifyToken, bookingController.getUserBookings);

module.exports = router;