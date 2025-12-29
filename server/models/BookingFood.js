const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BookingFood = sequelize.define('BookingFood', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    timestamps: true
});

module.exports = BookingFood;