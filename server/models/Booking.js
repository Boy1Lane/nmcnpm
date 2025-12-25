const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  showtimeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'USED'),
    defaultValue: 'PENDING'
  },
  paymentMethod: {
    type: DataTypes.ENUM('CREDIT_CARD', 'CASH'),
    defaultValue: 'CASH'
  }
}, {
  timestamps: true
});

module.exports = Booking;

