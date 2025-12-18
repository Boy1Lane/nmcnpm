const Showtime = require('../../models/Showtime');
const Room = require('../../models/Room');
const Seat = require('../../models/Seat');
const ShowtimeSeat = require('../../models/ShowtimeSeat');
const Movie = require('../../models/Movie');
const Cinema = require('../../models/Cinema');
const { Op } = require('sequelize');

exports.getSeatsByShowtime = async (req, res) => {
  try {
    const { showtimeId } = req.params;

    const seats = await ShowtimeSeat.findAll({
      where: { showtimeId },
      include: [{
        model: Seat,
        attributes: ['row', 'number', 'type'] // Chỉ lấy Hàng, Số, Loại
      }],
      order: [
        [Seat, 'row', 'ASC'], 
        [Seat, 'number', 'ASC']
      ]
    });

    if (!seats) {
      return res.status(404).json({ message: 'No showtime was found' });
    }

    res.status(200).json(seats);
  } catch {
    console.error(error);
    res.status(500).json({ message: 'Error when retrieving Seats by Showtime' });
  }
};

exports.getShowtimes = async (req, res) => {
  try {
    const { movieId, date } = req.query;
    const whereClause = {};

    // Filter by Movie
    if (movieId) {
      whereClause.movieId = movieId;
    }

    // Filter by Date (Find showtimes starting on this specific date)
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      whereClause.startTime = {
        [Op.between]: [startOfDay, endOfDay]
      };
    }

    const showtimes = await Showtime.findAll({
      where: whereClause,
      include: [
        { 
          model: Room, 
          attributes: ['id', 'name'],
          include: [{ model: Cinema, attributes: ['name', 'address'] }] // Show which Cinema/Room
        },
        {
          model: Movie,
          attributes: ['title', 'posterUrl', 'duration']
        }
      ],
      order: [['startTime', 'ASC']]
    });

    res.status(200).json(showtimes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching showtimes', error: error.message });
  }
};