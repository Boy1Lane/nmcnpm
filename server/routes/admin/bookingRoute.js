const express = require('express');
const router = express.Router();
const bookingController = require('../../controllers/admin/bookingController');

// POST /admin/bookings/confirm -> confirmBooking
router.post('/confirm', bookingController.confirmBooking);

// POST /admin/bookings/:bookingId/cancel -> cancelBooking
router.post('/:bookingId/cancel', bookingController.cancelBooking);

// GET /admin/bookings/summary -> getBookingSummary?month=&year=
router.get('/summary', bookingController.getBookingSummary);

// DELETE /admin/bookings/:id -> deleteBooking
router.delete('/:id', bookingController.deleteBooking);

// GET /admin/bookings/user/:userId -> getBookingsByUser
router.get('/user/:userId', bookingController.getBookingsByUser);

// GET /admin/bookings/showtime/:showtimeId -> getBookingsByShowtime
router.get('/showtime/:showtimeId', bookingController.getBookingsByShowtime);

// POST /admin/bookings/:id/seats -> addSeatsToBooking
router.post('/:id/seats', bookingController.addSeatsToBooking);

// DELETE /admin/bookings/:id/seats/:seatId -> removeSeatFromBooking
router.delete('/:id/seats/:seatId', bookingController.removeSeatFromBooking);

// POST /admin/bookings/:id/foods -> addFoodsToBooking
router.post('/:id/foods', bookingController.addFoodsToBooking);

// DELETE /admin/bookings/:id/foods/:foodId -> removeFoodFromBooking
router.delete('/:id/foods/:foodId', bookingController.removeFoodFromBooking);   

// GET /admin/bookings/:id -> getABooking
router.get('/:id', bookingController.getABooking);

// PUT /admin/bookings/:id -> updateBooking
router.put('/:id', bookingController.updateBooking);

// GET /admin/bookings -> getAllBookings
router.get('/', bookingController.getAllBookings);

// POST /admin/bookings -> createBooking
router.post('/', bookingController.createBooking);  

module.exports = router;