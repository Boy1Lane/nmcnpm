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

// Constraint: Ensure seat numbers are unique within the same room
Seat.addHook('beforeValidate', async (seat, options) => {
  const existingSeat = await Seat.findOne({
    where: {
      row: seat.row,
      number: seat.number,
      roomId: seat.roomId,
      id: { [DataTypes.Op.ne]: seat.id } // Exclude self for updates
    }
  });
  if (existingSeat) {
    throw new Error('Seat number must be unique within the same room.');
  }
});

module.exports = Seat;