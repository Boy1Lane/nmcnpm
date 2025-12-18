const express = require('express');
const router = express.Router();
const showtimeController = require('../../controllers/user/showtimeController');

router.get('/:showtimeId/seats', showtimeController.getSeatsByShowtime);

module.exports = router;