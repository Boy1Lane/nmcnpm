const movieRoutes = require('./movieRoutes');
const router = require('express').Router();


router.use('/movies', movieRoutes);


module.exports = router;