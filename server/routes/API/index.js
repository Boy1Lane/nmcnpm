const movieRoutes = require('./movieRoutes');
const showtimeRoutes = require('./showtimeRoutes');
const router = require('express').Router();

router.use('/movies', movieRoutes);
router.use('/showtimes', showtimeRoutes);

module.exports = router;