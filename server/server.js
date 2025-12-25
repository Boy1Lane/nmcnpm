// server/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const db = require("./config/db");
const Routes = require("./routes/index");
const cookieParser = require("cookie-parser");
const { User, Movie } = require('./models');

dotenv.config();

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

Routes(app);

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
  res.send('Server CinemaVerse is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});