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
  promotionId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  discountAmount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'USED'),
    defaultValue: 'PENDING'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    defaultValue: 'CASH'
  }
}, {
  timestamps: true
});

module.exports = Booking;

