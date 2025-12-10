const Booking = require('../../models/Booking');
const BookingSeat = require('../../models/BookingSeat');

// GET /admin/bookings -> getAllBookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();  
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'getAllBookings error' });
  }
};

// POST /admin/bookings -> createBooking
exports.createBooking = async (req, res) => {
  try {
    const { userId, showtimeId, totalPrice } = req.body;
    if (!userId || !showtimeId || !totalPrice) {
      return res.status(400).json({ message: 'Missing value (userId, showtimeId, totalPrice)!' });
    }
    const newBooking = await Booking.create({ userId, showtimeId, totalPrice });
    res.status(201).json({
      message: 'Booking created successfully!',
      data: newBooking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'server error', error: error.message });
  }
};  

// GET /admin/bookings/:id -> getABooking
exports.getABooking = async (req, res) => {
  try {
    const { id } = req.params;  
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'getABooking error' });
  }
};

// PUT /admin/bookings/:id -> updateBooking
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, showtimeId, totalPrice } = req.body;
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.userId = userId || booking.userId;
    booking.showtimeId = showtimeId || booking.showtimeId;
    booking.totalPrice = totalPrice || booking.totalPrice;
    await booking.save();
    res.status(200).json({ 
        message: 'Booking updated successfully', booking 
    });
  } catch (error) {
    res.status(500).json({ message: 'updateBooking error' });
  }
};

// DELETE /admin/bookings/:id -> deleteBooking
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    await booking.destroy();
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'deleteBooking error' });
  }
};

// GET /admin/bookings/user/:userId -> getBookingsByUser
exports.getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.findAll({ where: { userId } });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'getBookingsByUser error' });
  }
};

// GET /admin/bookings/showtime/:showtimeId -> getBookingsByShowtime
exports.getBookingsByShowtime = async (req, res) => {
  try {
    const { showtimeId } = req.params;
    const bookings = await Booking.findAll({ where: { showtimeId } });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'getBookingsByShowtime error' });
  }
};

// POST /admin/bookings/:id/seats -> addSeatsToBooking
exports.addSeatsToBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { seatIds } = req.body;
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    const bookingSeats = seatIds.map(seatId => ({
      bookingId: id,
      seatId
    }));
    await BookingSeat.bulkCreate(bookingSeats);
    res.status(201).json({ 
        message: 'Seats added to booking successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: 'addSeatsToBooking error' });
  }
};

// DELETE /admin/bookings/:id/seats/:seatId -> removeSeatFromBooking
exports.removeSeatFromBooking = async (req, res) => {
  try {
    const { id, seatId } = req.params;
    const bookingSeat = await BookingSeat.findOne({ 
      where: { bookingId: id, seatId } 
    }); 
    if (!bookingSeat) {
      return res.status(404).json({ message: 'Seat not found in booking' });
    }
    await bookingSeat.destroy();
    res.status(200).json({ 
        message: 'Seat removed from booking successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: 'removeSeatFromBooking error' });
  } 
};

// GET /admin/bookings/summary -> getBookingSummary?month=&year=
exports.getBookingSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const whereClause = {};
    if (month && year) {
      whereClause.createdAt = {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1)
      };
    } else if (year) {
      whereClause.createdAt = {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1)
      };
    }
    const totalBookings = await Booking.count({ where: whereClause });
    const totalRevenue = await Booking.sum('totalPrice', { where: whereClause });
    res.status(200).json({ totalBookings, totalRevenue });
  } catch (error) {
    res.status(500).json({ message: 'getBookingSummary error' });
  }
};