const {DataTypes, Model} = require('sequelize');
const sequelize = require('../config/db');

const Promotion = sequelize.define('Promotion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  discountPercentage: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  validFrom: {
    type: DataTypes.DATE,
    allowNull: false
  },
  validTo: {
    type: DataTypes.DATE,
    allowNull: false
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  timesUsed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: false
});

module.exports = Promotion;