const { Sequelize } = require('sequelize');

// Chúng ta điền trực tiếp thông tin vào đây để tránh lỗi không đọc được file .env
const sequelize = new Sequelize(
    'postgres',   // Tên Database
    'postgres',  // Username
    'ha031105',    // Password (Lưu ý: Phải để trong dấu ngoặc kép '...')
    {
        host: 'localhost',
        dialect: 'postgres', // Khai báo rõ ràng là dùng PostgreSQL
        logging: false,      // Tắt log cho gọn
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

module.exports = sequelize;