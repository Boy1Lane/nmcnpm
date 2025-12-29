const express = require('express');
const router = express.Router();
const movieController = require('../../controllers/admin/movieController');
const uploadMovieMedia = require('../../middlewares/uploadMovieMediaMiddleware');

// GET /api/movies -> getAllMovies
router.get('/', movieController.getAllMovies);

// POST /api/movies -> createMovie
router.post(
	'/',
	uploadMovieMedia.fields([
		{ name: 'poster', maxCount: 1 },
		{ name: 'trailer', maxCount: 1 }
	]),
	movieController.createMovie
);

// GET /api/movies/:id -> getAMovie
router.get('/:id', movieController.getAMovie);

// PUT /api/movies/:id -> updateMovie
router.put(
	'/:id',
	uploadMovieMedia.fields([
		{ name: 'poster', maxCount: 1 },
		{ name: 'trailer', maxCount: 1 }
	]),
	movieController.updateMovie
);

// DELETE /api/movies/:id -> deleteMovie
router.delete('/:id', movieController.deleteMovie);

module.exports = router;