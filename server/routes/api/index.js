const movieRoutes = require('./movieRoute');
const showtimeRoutes = require('./showtimeRoute.js');
const bookingRoutes = require('./bookingRoute.js');
const userRoutes = require('./userRoute.js');
const foodRoutes = require('./foodRoute.js');
const promotionRoutes = require('./promotionRoute.js');
const router = require('express').Router();

router.use('/movies', movieRoutes);
router.use('/showtimes', showtimeRoutes);
router.use('/bookings', bookingRoutes);
router.use('/users', userRoutes);
router.use('/foods', foodRoutes);
router.use('/promotions', promotionRoutes);

module.exports = router;