const { DataTypes } = require('sequelize');
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

// Constraint: Ensure showtimes in the same room do not overlap
Showtime.addHook('beforeValidate', async (showtime, options) => {
  const overlappingShowtimes = await Showtime.findAll({ 
    where: {
      roomId: showtime.roomId,
      id: { [DataTypes.Op.ne]: showtime.id }, // Exclude self for updates
      [DataTypes.Op.or]: [
        {
          startTime: {
            [DataTypes.Op.between]: [showtime.startTime, showtime.endTime]
          }
        },
        {
          endTime: {
            [DataTypes.Op.between]: [showtime.startTime, showtime.endTime]
          }
        },
        {
          [DataTypes.Op.and]: [
            {
              startTime: {
                [DataTypes.Op.lte]: showtime.startTime
              }
            },
            {
              endTime: {
                [DataTypes.Op.gte]: showtime.endTime
              }
            }
          ]
        }
      ]
    }
  });
  if (overlappingShowtimes.length > 0) {
    throw new Error('Showtime overlaps with an existing showtime in the same room.');
  }
});

module.exports = Showtime;