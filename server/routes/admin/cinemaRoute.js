const express = require('express');
const router = express.Router();
const cinemaController = require('../../controllers/admin/cinemaController');

// GET /admin/cinemas -> getAllCinemas
router.get('/', cinemaController.getAllCinemas);

// POST /admin/cinemas -> createCinema
router.post('/', cinemaController.createCinema);

// GET /admin/cinemas/:id -> getACinema
router.get('/:id', cinemaController.getACinema);

// PUT /admin/cinemas/:id -> updateCinema
router.put('/:id', cinemaController.updateCinema);

// DELETE /admin/cinemas/:id -> deleteCinema
router.delete('/:id', cinemaController.deleteCinema);

// GET /admin/cinemas/:id/rooms -> getRoomsByCinema
router.get('/:id/rooms', cinemaController.getRoomsByCinema);

// POST /admin/cinemas/:id/rooms -> addRoomToCinema
router.post('/:id/rooms', cinemaController.addRoomToCinema);

// DELETE /admin/cinemas/:cinemaId/rooms/:roomId -> removeRoomFromCinema
router.delete('/:cinemaId/rooms/:roomId', cinemaController.removeRoomFromCinema);

module.exports = router;