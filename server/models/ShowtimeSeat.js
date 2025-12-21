const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ShowtimeSeat = sequelize.define('ShowtimeSeat', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  status: {
    type: DataTypes.ENUM('AVAILABLE', 'LOCKED', 'SOLD'),
    defaultValue: 'AVAILABLE'
  },
  price: {
    type: DataTypes.INTEGER, // Final price
    allowNull: false
  },
  lockedAt: {
    type: DataTypes.DATE, // Time started to lock seat
    allowNull: true
  }
  // showtimeID and seatID to be add 
},  {
  timestamps: false
});

module.exports = ShowtimeSeat;