const express = require('express');
const router = express.Router();
const showtimeController = require('../../controllers/admin/showtimeController');

// GET /admin/showtimes -> getAllShowtimes
router.get('/', showtimeController.getAllShowtimes);

// POST /admin/showtimes -> createShowtime
router.post('/', showtimeController.createShowtime);

// GET /admin/showtimes/:showtimeId/seats -> getSeatsByShowtime
router.get('/:showtimeId/seats', showtimeController.getSeatsByShowtime);

// POST /admin/showtimes/:showtimeId/seats -> addSeatsToShowtime
router.post('/:showtimeId/seats', showtimeController.addSeatsToShowtime);

// DELETE /admin/showtimes/:showtimeId/seats/:seatId -> removeSeatFromShowtime
router.delete('/:showtimeId/seats/:seatId', showtimeController.removeSeatFromShowtime);

// PUT /admin/showtimes/:showtimeId/seats/seatID -> changeSeatStatusInShowtime
router.put('/:showtimeId/seats/:seatId', showtimeController.changeSeatStatusInShowtime);

// GET /admin/showtimes/:id -> getAShowtime
router.get('/:id', showtimeController.getAShowtime);

// PUT /admin/showtimes/:id -> updateShowtime
router.put('/:id', showtimeController.updateShowtime);

// DELETE /admin/showtimes/:id -> deleteShowtime
router.delete('/:id', showtimeController.deleteShowtime);

module.exports = router;
