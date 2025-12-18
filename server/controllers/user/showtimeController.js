const Showtime = require('../../models/Showtime');
const Room = require('../../models/Room');
const Seat = require('../../models/Seat');
const ShowtimeSeat = require('../../models/ShowtimeSeat');
const Movie = require('../../models/Movie')

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