const adminRoutes = require('./Admin/index');
const adminRoutes1= require('./Admin/movieRoute');
const apiRoutes = require('./api/index');
const authRoutes = require('./authRoute');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

function Routes(app) {
    app.use('/api', apiRoutes);
    app.use('/admin', authMiddleware, adminMiddleware, adminRoutes,adminRoutes1);
    app.use('/auth', authRoutes);
    app.get('/', (req, res) => {
        res.send('Xin chào! Server CinemaVerse đang chạy ổn định.');
    }
    );
}

module.exports = Routes;