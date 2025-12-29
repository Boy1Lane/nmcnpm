const express = require('express');
const router = express.Router();
const movieController = require('../../controllers/client/movieController');

// API: /api/movies
router.get('/', movieController.getMovies);

// API: /api/movies/:id (Lấy chi tiết để xem lịch chiếu)
router.get('/:id', movieController.getMovieDetail);

module.exports = router;