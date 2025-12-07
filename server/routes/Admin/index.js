const movieRoutes = require('./movieRoute');
const router = require('express').Router();


router.use('/movies', movieRoutes);


module.exports = router;