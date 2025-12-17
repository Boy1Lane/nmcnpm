const { DataTypes,Op } = require('sequelize');
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

<<<<<<< HEAD
=======
// Constraint: Ensure room names are unique within the same cinema
Room.addHook('beforeValidate', async (room, options) => {
  const existingRoom = await Room.findOne({ 
    where: { 
      name: room.name, 
      cinemaId: room.cinemaId,
      id: { [Op.ne]: room.id } // Exclude self for updates
    }
  });
  if (existingRoom) {
    throw new Error('Room name must be unique within the same cinema.');
  }
}); 
>>>>>>> babfc67 (Update Room and Showtime models)

module.exports = Room;