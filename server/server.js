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

Cinema.hasMany(Room, { foreignKey: 'cinemaId' });
Room.belongsTo(Cinema, { foreignKey: 'cinemaId' });

Room.hasMany(Seat, { foreignKey: 'roomId' });
Seat.belongsTo(Room, { foreignKey: 'roomId' });

Movie.hasMany(Showtime, { foreignKey: 'movieId' });
Showtime.belongsTo(Movie, { foreignKey: 'movieId' });

Room.hasMany(Showtime, { foreignKey: 'roomId' });
Showtime.belongsTo(Room, { foreignKey: 'roomId' });

dotenv.config()

const app = express();

app.use(cors())
app.use(express.json());

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
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});