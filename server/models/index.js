const sequelize = require('../config/db');
const User = require('./User');
const Movie = require('./Movie');
const Cinema = require('./Cinema');
const Room = require('./Room');
const Seat = require('./Seat');
const Showtime = require('./Showtime');
const ShowtimeSeat = require('./ShowtimeSeat');
const Booking = require('./Booking');
const BookingSeat = require('./BookingSeat');

// Relationship: A Cinema has many Rooms
Cinema.hasMany(Room, { foreignKey: 'cinemaId' });
Room.belongsTo(Cinema, { foreignKey: 'cinemaId' });

// Relationship: A Room has many physical Seats
Room.hasMany(Seat, { foreignKey: 'roomId' });
Seat.belongsTo(Room, { foreignKey: 'roomId' });

// Relationship: A Movie has many Showtimes
Movie.hasMany(Showtime, { foreignKey: 'movieId' });
Showtime.belongsTo(Movie, { foreignKey: 'movieId' });

// Relationship: A Room hosts many Showtimes
Room.hasMany(Showtime, { foreignKey: 'roomId' });
Showtime.belongsTo(Room, { foreignKey: 'roomId' });

// Relationship: Many-to-Many between Showtime and Seat
// Connects specific showtimes to physical seats via the ShowtimeSeat junction table
Showtime.belongsToMany(Seat, { through: ShowtimeSeat, foreignKey: 'showtimeId' });
Seat.belongsToMany(Showtime, { through: ShowtimeSeat, foreignKey: 'seatId' });

// Super Many-to-Many: Direct associations to the junction table (ShowtimeSeat)
// Allows querying the status (booked/available) of a seat for a specific showtime directly
Showtime.hasMany(ShowtimeSeat, { foreignKey: 'showtimeId' });
ShowtimeSeat.belongsTo(Showtime, { foreignKey: 'showtimeId' });

Seat.hasMany(ShowtimeSeat, { foreignKey: 'seatId' });
ShowtimeSeat.belongsTo(Seat, { foreignKey: 'seatId' });

// Relationship: A User can have many Bookings
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

// Relationship: A Showtime can have many Bookings
Showtime.hasMany(Booking, { foreignKey: 'showtimeId' });
Booking.belongsTo(Showtime, { foreignKey: 'showtimeId' });

// Relationship: A Booking can have many BookingSeats
Booking.hasMany(BookingSeat, { foreignKey: 'bookingId' });
BookingSeat.belongsTo(Booking, { foreignKey: 'bookingId' });

// Relationship: A ShowtimeSeat can have many BookingSeats
ShowtimeSeat.hasMany(BookingSeat, { foreignKey: 'showtimeSeatId' });
BookingSeat.belongsTo(ShowtimeSeat, { foreignKey: 'showtimeSeatId' });

// Constraints and Indexes can be defined within individual model files

module.exports = {
    sequelize,
    User,
    Movie,
    Cinema,
    Room,
    Seat,
    Showtime,
    ShowtimeSeat,
    Booking,
    BookingSeat
};
