const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false // Room 01
  },
  type: {
    type: DataTypes.ENUM('2D', '3D', 'IMAX'),
    defaultValue: '2D'
  },
  totalSeats: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
});

module.exports = Room;