const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  director: {
    type: DataTypes.STRING,
    allowNull: true
  },
  actor: {
    type: DataTypes.STRING,
    allowNull: true
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER, // Duration in minutes
    allowNull: false
  },
  releaseDate: {
    type: DataTypes.DATEONLY, // Date
    allowNull: false
  },
  posterUrl: {
    type: DataTypes.STRING, // poster link
    allowNull: true
  },
  trailerUrl: {
    type: DataTypes.STRING, // trailer link
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('showing', 'coming_soon', 'ended'),
    defaultValue: 'coming_soon'
  }
}, {
  timestamps: false
});

module.exports = Movie;