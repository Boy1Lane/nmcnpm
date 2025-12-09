const movieRoutes = require('./movieRoute.js');
const roomRoutes = require('./roomRoute.js');
const showtimeRoutes = require('./showtimeRoute.js');
const router = require('express').Router();
const roomRoutes = require('../Admin/roomRoute.js');

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

// /admin/rooms
router.use('/rooms', roomRoutes);   //theem check

module.exports = router;