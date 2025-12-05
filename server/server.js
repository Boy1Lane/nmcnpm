const express = require("express")
const cors = require("cors")
const dotenv = require('dotenv');
const db = require("./config/db")
const User = require('./models/User');

dotenv.config()

const app = express();

app.use(cors())
app.use(express.json());

db.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL');
    return db.sync({ force: false });
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