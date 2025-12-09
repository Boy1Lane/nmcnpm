const express = require('express');
const router = express.Router();
const showtimeController = require('../../controllers/admin/showtimeController');

// GET /admin/showtimes -> getAllShowtimes
router.get('/', showtimeController.getAllShowtimes);

// POST /admin/showtimes -> createShowtime
router.post('/', showtimeController.createShowtime);

// GET /admin/showtimes/:id -> getAShowtime
router.get('/:id', showtimeController.getAShowtime);

// PUT /admin/showtimes/:id -> updateShowtime
router.put('/:id', showtimeController.updateShowtime);

// DELETE /admin/showtimes/:id -> deleteShowtime
router.delete('/:id', showtimeController.deleteShowtime);

module.exports = router;
