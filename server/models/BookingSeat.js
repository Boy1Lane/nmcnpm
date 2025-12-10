const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BookingSeat = sequelize.define('BookingSeat', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    bookingId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    showtimeSeatId: {   
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

// Constraint: Ensure a seat for a specific showtime can only be booked once per booking
BookingSeat.addHook('beforeValidate', async (bookingSeat, options) => {
    const existingBookingSeat = await BookingSeat.findOne({ 
        where: { 
            bookingId: bookingSeat.bookingId, 
            showtimeSeatId: bookingSeat.showtimeSeatId,
            id: { [DataTypes.Op.ne]: bookingSeat.id } // Exclude self for updates
        }
    });
    if (existingBookingSeat) {
        throw new Error('This seat for the specified showtime is already booked in this booking.');
    }
});

module.exports = BookingSeat;