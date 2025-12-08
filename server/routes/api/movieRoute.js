const express = require('express');
const router = express.Router();
const movieController = require('../../controllers/user/movieController');

// GET /api/movies -> getAllMovies
router.get('/', movieController.getAllMovies);

// POST /api/movies -> createMovie
router.post('/', movieController.createMovie);

module.exports = router;