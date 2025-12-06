const express = require("express")
const cors = require("cors")
const dotenv = require('dotenv');
const db = require("./config/db")
const User = require('./models/User');
const Movie = require('./models/Movie');
const Cinema = require('./models/Cinema');
const Room = require('./models/Room');
const Seat = require('./models/Seat');
const Showtime = require('./models/Showtime');
const ShowtimeSeat = require('./models/ShowtimeSeat');

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

dotenv.config()

const app = express();

app.use(cors())
app.use(express.json());

const movieRoutes = require('./routes/movieRoutes');
app.use('/api/movies', movieRoutes);

const showtimeRoutes = require('./routes/showtimeRoutes');
app.use('/api/showtimes', showtimeRoutes);

db.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL');
    return db.sync({ alter: true });
  })
  .then(() => {
    console.log('Synced Models with DB');
  })
  .catch((err) => {
    console.error('Failed connection:', err);
  });

app.get('/', (req, res) => {
  res.send('Xin chào! Server CinemaVerse đang chạy ổn định.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});