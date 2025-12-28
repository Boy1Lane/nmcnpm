const express = require('express');
const router = express.Router();
const movieController = require('../../controllers/admin/movieController');
const upload = require('../../middlewares/uploadMiddleware');

// GET /api/movies -> getAllMovies
router.get('/', movieController.getAllMovies);

// POST /api/movies -> createMovie
router.post('/', upload.single('poster'), movieController.createMovie);

// GET /api/movies/:id -> getAMovie
router.get('/:id', movieController.getAMovie);

// PUT /api/movies/:id -> updateMovie
router.put('/:id', upload.single('poster'), movieController.updateMovie);

// DELETE /api/movies/:id -> deleteMovie
router.delete('/:id', movieController.deleteMovie);

module.exports = router;