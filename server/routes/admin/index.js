const movieRoutes = require('./movieRoute.js');
const roomRoutes = require('./roomRoute.js');
const showtimeRoutes = require('./showtimeRoute.js');
const router = require('express').Router();

// /admin/movies -> movieRoutes
router.use('/movies', movieRoutes);

// /admin/rooms -> roomRoutes
router.use('/rooms', roomRoutes);

// /admin/showtimes -> showtimeRoutes
router.use('/showtimes', showtimeRoutes);

// /admin 
router.get('/', (req, res) => {
  res.json({ message: 'Admin Home' });
});

module.exports = router;