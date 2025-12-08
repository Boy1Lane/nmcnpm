const movieRoutes = require('./movieRoute');
const adminController = require('../../controllers/admin/adminController');
const router = require('express').Router();

// /admin/movies -> movieRoutes
router.use('/movies', movieRoutes);
// /admin/set-role -> setUserRole
router.post('/set-role', adminController.setUserRole);

module.exports = router;