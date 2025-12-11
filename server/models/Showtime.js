const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/db');

const Showtime = sequelize.define('Showtime', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  startTime: {
    type: DataTypes.DATE, // Day and time
    allowNull: false
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  basePrice: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Showtime;