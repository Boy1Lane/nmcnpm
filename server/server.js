const express = require("express")
const cors = require("cors")
const dotenv = require('dotenv');
const db = require("./config/db")
const { User, Movie, Cinema, Room, Seat, Showtime, ShowtimeSeat } = require('./models');
const Routes = require("./routes/index");
const cookieParser = require("cookie-parser");
const startCleanupJob = require('./services/cleanupService');

dotenv.config()

const app = express();

// app.use(cors())
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Initialize Routes
Routes(app);

startCleanupJob();

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