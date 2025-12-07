const adminRoutes = require('./admin/index');
const apiRoutes = require('./api/index');
const authRoutes = require('./authRoute');

function Routes(app) {
    app.use('/api', apiRoutes);
    app.use('/admin', adminRoutes);
    app.use('/auth', authRoutes);
    app.get('/', (req, res) => {
        res.send('Xin chào! Server CinemaVerse đang chạy ổn định.');
    }
    );
}

module.exports = Routes;