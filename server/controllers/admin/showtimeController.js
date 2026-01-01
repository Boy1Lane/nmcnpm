const Showtime = require('../../models/Showtime');
const ShowtimeSeat = require('../../models/ShowtimeSeat');
//them check
const { Op } = require("sequelize");
const Movie = require("../../models/Movie");
const Room = require("../../models/Room");

// GET /admin/showtimes -> getAllShowtimes
// exports.getAllShowtimes = async (req, res) => {
//   try {
//     const showtimes = await Showtime.findAll();
//     res.status(200).json(showtimes);
//     } catch (error) {
//     res.status(500).json({ message: 'getAllShowtimes error' });
//   }
// };

// POST /admin/showtimes -> createShowtime
exports.createShowtime = async (req, res) => {
  try {
    console.log("📩 Received:", req.body);
    const { movieId, roomId, startTime, endTime, basePrice } = req.body;
    if (!movieId || !roomId || !startTime || !endTime || !basePrice) {
      return res.status(400).json({ message: 'Missing value (movieId, roomId, startTime, endTime, basePrice)!' });
    }
    const newShowtime = await Showtime.create({ movieId, roomId, startTime, endTime, basePrice });

    // 1. Lấy tất cả ghế trong phòng đó
    const seats = await Seat.findAll({ where: { roomId } });

    // 2. Tạo ShowtimeSeat cho từng ghế
    const showtimeSeats = seats.map(seat => ({
      showtimeId: newShowtime.id,
      seatId: seat.id,
      status: 'AVAILABLE',
      price: Math.round(basePrice * seat.priceMultiplier) // Tính giá theo hệ số ghế VIP/Thường
    }));

    await ShowtimeSeat.bulkCreate(showtimeSeats);

    res.status(201).json({
      message: 'Showtime created successfully!',
      data: newShowtime
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'server error', error: error.message });
  }
};

// GET /admin/showtimes/:id -> getAShowtime
exports.getAShowtime = async (req, res) => {
  try {
    const { id } = req.params;
    const showtime = await Showtime.findByPk(id);
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }
    res.status(200).json(showtime);
  } catch (error) {
    res.status(500).json({ message: 'getAShowtime error' });
  }
};

// PUT /admin/showtimes/:id -> updateShowtime
exports.updateShowtime = async (req, res) => {
  try {
    const { id } = req.params;
    const { movieId, roomId, startTime, endTime, basePrice } = req.body;
    const showtime = await Showtime.findByPk(id);
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }
    showtime.movieId = movieId || showtime.movieId;
    showtime.roomId = roomId || showtime.roomId;
    showtime.startTime = startTime || showtime.startTime;
    showtime.endTime = endTime || showtime.endTime;
    showtime.basePrice = basePrice || showtime.basePrice;
    await showtime.save();
    res.status(200).json({
      message: 'Showtime updated successfully', showtime
    });
  }
  catch (error) {
    res.status(500).json({ message: 'updateShowtime error' });
  }
};

// DELETE /admin/showtimes/:id -> deleteShowtime
exports.deleteShowtime = async (req, res) => {
  try {
    const { id } = req.params;
    const showtime = await Showtime.findByPk(id);
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }
    await showtime.destroy();
    res.status(200).json({ message: 'Showtime deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'deleteShowtime error' });
  }
};

//them check
exports.getAllShowtimes = async (req, res) => {
  try {
    const { date } = req.query;

    let where = {};

    if (date) {
      where.startTime = {
        [Op.between]: [
          `${date} 00:00:00`,
          `${date} 23:59:59`
        ]
      };
    }

    const showtimes = await Showtime.findAll({
      where,
      include: [
        {
          model: Movie,
          attributes: ["id", "title", "posterUrl", "duration"]
        },
        {
            model: Room,
            attributes: ["id", "name", "type", "totalSeats", "cinemaId"]
        }
      ],
      order: [["startTime", "ASC"]]
    });

    res.status(200).json(showtimes);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "getAllShowtimes error" });
  }
};

// GET /admin/showtimes/:showtimeId/seats -> getSeatsByShowtime
exports.getSeatsByShowtime = async (req, res) => {
  try {
    const { showtimeId } = req.params;
    const showtimeSeat = await ShowtimeSeat.findAll({ where: { showtimeId } });
    if (!showtimeSeat) {
      return res.status(404).json({ message: 'Showtime not found' });
    }
    res.status(200).json(showtimeSeat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'getSeatsByShowtime error' });
  }
};

// POST /admin/showtimes/:showtimeId/seats -> addSeatsToShowtime
exports.addSeatsToShowtime = async (req, res) => {
  try {
    const { showtimeId } = req.params;
    const { seatIds } = req.body;
    const { price } = req.body;
    const showtimeSeat = await ShowtimeSeat.findAll({ where: { showtimeId } });
    if (!showtimeSeat) {
      return res.status(404).json({ message: 'Showtime not found' });
    }
    for (const seatId of seatIds) {
      await ShowtimeSeat.create({ showtimeId, seatId, status: 'AVAILABLE', price });
    }
    res.status(200).json({ message: 'Seats added to showtime successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'addSeatsToShowtime error' });
  }
};

// DELETE /admin/showtimes/:showtimeId/seats/:seatId -> removeSeatFromShowtime
exports.removeSeatFromShowtime = async (req, res) => {
  try {
    const { showtimeId, seatId } = req.params;
    const showtime = await Showtime.findByPk(showtimeId);
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }
    await showtime.removeSeat(seatId);
    res.status(200).json({ message: 'Seat removed from showtime successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'removeSeatFromShowtime error' });
  }
};

// PUT /admin/showtimes/:showtimeId/seats/seatID -> changeSeatStatusInShowtime
exports.changeSeatStatusInShowtime = async (req, res) => {
  try {
    const { showtimeId, seatId } = req.params;
    const { status } = req.body;
    const showtime = await Showtime.findByPk(showtimeId);
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }
    const seats = await showtime.getSeats({ where: { id: seatId } });
    if (seats.length === 0) {
      return res.status(404).json({ message: 'Seat not found in showtime' });
    }
    const seat = seats[0];
    await showtime.addSeat(seat, { through: { status } });
    res.status(200).json({ message: 'Seat status updated successfully in showtime' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'changeSeatStatusInShowtime error' });
  }
};