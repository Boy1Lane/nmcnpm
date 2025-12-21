const { DataTypes,Op } = require('sequelize');
const sequelize = require('../config/db');

const Cinema = sequelize.define('Cinema', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});

// Constraint: Ensure cinema names are unique
Cinema.addHook('beforeValidate', async (cinema, options) => {
  const existingCinema = await Cinema.findOne({
    where: { 
      name: cinema.name,
      id: { [Op.ne]: cinema.id } // Exclude self for updates
    }
  });
  if (existingCinema) {
    throw new Error('Cinema name must be unique.');
  }
});

module.exports = Cinema;