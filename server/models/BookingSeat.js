const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BookingSeat = sequelize.define('BookingSeat', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    bookingId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    showtimeSeatId: {   
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = BookingSeat;