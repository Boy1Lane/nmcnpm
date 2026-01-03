const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Seat = sequelize.define('Seat', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Rooms',
      key: 'id'
    }
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
    type: DataTypes.ENUM('NORMAL', 'VIP'),
    defaultValue: 'NORMAL'
  },
  priceMultiplier: {
    type: DataTypes.FLOAT,
    defaultValue: 1.0 // Normal x1, VIP x1.2
  }
}, {
  timestamps: false
});



module.exports = Seat;