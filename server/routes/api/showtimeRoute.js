const express = require('express');
const router = express.Router();
const showtimeController = require('../../controllers/user/showtimeController');

// GET /api/showtimes -> getAllMovies
router.post('/', showtimeController.createShowtime);

router.get('/:showtimeId/seats', showtimeController.getSeatsByShowtime);

module.exports = router;