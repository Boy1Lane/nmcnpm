const express = require('express');
const router = express.Router();
const roomController = require('../../controllers/admin/roomController');

// GET /admin/rooms -> getAllRooms
router.get('/', roomController.getAllRooms);

// POST /admin/rooms -> createRoom
router.post('/', roomController.createRoom);

// GET /admin/rooms/:id -> getARoom
router.get('/:id', roomController.getARoom);

// PUT /admin/rooms/:id -> updateRoom
router.put('/:id', roomController.updateRoom);

// DELETE /admin/rooms/:id -> deleteRoom
router.delete('/:id', roomController.deleteRoom);

module.exports = router;