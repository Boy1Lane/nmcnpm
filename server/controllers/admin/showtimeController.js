const Showtime = require('../../models/Showtime');

// GET /admin/showtimes -> getAllShowtimes
exports.getAllShowtimes = async (req, res) => {
  try {
    const showtimes = await Showtime.findAll();
    res.status(200).json(showtimes);
    } catch (error) {
    res.status(500).json({ message: 'getAllShowtimes error' });
  }
};

// POST /admin/showtimes -> createShowtime
exports.createShowtime = async (req, res) => {
  try {
    console.log("📩 Received:", req.body);
    const { movieId, roomId, startTime, endTime, basePrice } = req.body;
    if (!movieId || !roomId || !startTime || !endTime || !basePrice) {
      return res.status(400).json({ message: 'Missing value (movieId, roomId, startTime, endTime, basePrice)!' });
    }
    const newShowtime = await Showtime.create({ movieId, roomId, startTime, endTime, basePrice });
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

