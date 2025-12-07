const express = require('express');
const router = express.Router();
const showtimeController = require('../../controllers/showtimeController');

// GET /api/showtimes -> getAllMovies
router.post('/', showtimeController.createShowtime);

module.exports = router;