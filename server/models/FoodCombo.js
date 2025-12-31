const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FoodCombo = sequelize.define('FoodCombo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  items: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  pictureUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: false
});

module.exports = FoodCombo;
