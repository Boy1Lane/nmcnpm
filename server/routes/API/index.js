const movieRoutes = require('./movieRoute');
const showtimeRoutes = require('./showtimeRoute');
const router = require('express').Router();

router.use('/movies', movieRoutes);
router.use('/showtimes', showtimeRoutes);

module.exports = router;