const adminRoutes = require('./admin/index');
const apiRoutes = require('./api/index');
const authRoutes = require('./authRoute');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const staffMiddleware = require('../middlewares/staffMiddleware');

function Routes(app) {
    app.use('/api', apiRoutes);
    // app.use('/admin', authMiddleware, adminMiddleware, adminRoutes);
    app.use('/admin', staffMiddleware, adminRoutes);
    app.use('/auth', authRoutes);
    app.get('/', (req, res)  => {
        res.send('Xin chào! Server CinemaVerse đang chạy ổn định.');
    }
    );
}

module.exports = Routes;