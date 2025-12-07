const adminRoutes = require('./Admin/index');
const apiRoutes = require('./API/index');

function Routes(app) {
    app.use('/api', apiRoutes);
    app.use('/admin', adminRoutes);

    app.get('/', (req, res) => {
        res.send('Xin chào! Server CinemaVerse đang chạy ổn định.');
    }
    );
}

module.exports = Routes;