const express = require("express")
const cors = require("cors")
const dotenv = require('dotenv');
const db = require("./config/db")
const { User, Movie, Cinema, Room, Seat, Showtime, ShowtimeSeat } = require('./models');

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