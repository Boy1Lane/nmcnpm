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

// Constraint: Ensure showtimes in the same room do not overlap
Showtime.addHook('beforeValidate', async (showtime, options) => {
  const overlappingShowtimes = await Showtime.findAll({ 
    where: {
      roomId: showtime.roomId,
      id: { [Op.ne]: showtime.id }, // Exclude self for updates
      [Op.or]: [
        {
          startTime: {
            [Op.between]: [showtime.startTime, showtime.endTime]
          }
        },
        {
          endTime: {
            [Op.between]: [showtime.startTime, showtime.endTime]
          }
        },
        {
          [Op.and]: [
            {
              startTime: {
                [Op.lte]: showtime.startTime
              }
            },
            {
              endTime: {
                [Op.gte]: showtime.endTime
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