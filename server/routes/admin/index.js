const movieRoutes = require('./movieRoute.js');
const roomRoutes = require('./roomRoute.js');
const showtimeRoutes = require('./showtimeRoute.js');
const cinemaRoutes = require('./cinemaRoute.js');
const userRoutes = require('./userRoute.js');
const bookingRoutes = require('./bookingRoute.js');
const router = require('express').Router();


// /admin/movies -> movieRoutes
router.use('/movies', movieRoutes);

// /admin/rooms -> roomRoutes
router.use('/rooms', roomRoutes);

// /admin/showtimes -> showtimeRoutes
router.use('/showtimes', showtimeRoutes);

// /admin/cinemas -> cinemaRoutes
router.use('/cinemas', cinemaRoutes);

// /admin/users -> userRoutes
router.use('/users', userRoutes);

// /admin/bookings -> bookingRoutes
router.use('/bookings', bookingRoutes);

// /admin 
router.get('/', (req, res) => {
  res.json({ message: 'Admin Home' });
});

module.exports = router;