const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Seat = sequelize.define('Seat', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  row: {
    type: DataTypes.STRING,
    allowNull: false // 'A', 'B'
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('NORMAL', 'VIP', 'COUPLE'),
    defaultValue: 'NORMAL'
  },
  priceMultiplier: {
    type: DataTypes.FLOAT,
    defaultValue: 1.0 // Normal x1, VIP x1.2
  }
});

module.exports = Seat;