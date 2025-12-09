const movieRoutes = require('./movieRoute.js');
const adminController = require('../../controllers/admin/adminController');
const router = require('express').Router();
const roomRoutes = require('../Admin/roomRoute.js');

// /admin/movies -> movieRoutes
router.use('/movies', movieRoutes);
// /admin/set-role -> setUserRole
router.post('/set-role', adminController.setUserRole);

// /admin/rooms
router.use('/rooms', roomRoutes);   //theem check

module.exports = router;