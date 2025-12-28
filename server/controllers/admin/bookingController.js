const Booking = require('../../models/Booking');
const BookingSeat = require('../../models/BookingSeat');
const BookingFood = require('../../models/BookingFood');
const { Op } = require('sequelize');

// GET /admin/bookings -> getAllBookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll(); 
    const bookingsWithSeats = await Promise.all(bookings.map(async (booking) => {
      const seats = await BookingSeat.findAll({ where: { bookingId: booking.id } });
      return { ...booking.toJSON(), seats };
    })); 
    res.status(200).json(bookingsWithSeats);
  } catch (error) {
    res.status(500).json({ message: 'getAllBookings error' });
  }
};

// POST /admin/bookings -> createBooking
exports.createBooking = async (req, res) => {
  try {
    const { userId, showtimeId, totalPrice, paymentMethod } = req.body;
    if (!userId || !showtimeId || !totalPrice || !paymentMethod) {
      return res.status(400).json({ message: 'Missing value (userId, showtimeId, totalPrice, paymentMethod)!' });
    }
    const newBooking = await Booking.create({ userId, showtimeId, totalPrice, paymentMethod });
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
    const bookingSeats = await BookingSeat.findAll({ where: { bookingId: id } });
    if (booking) {
      booking.dataValues.seats = bookingSeats;
    }
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
    const { userId, showtimeId, totalPrice, status, paymentMethod } = req.body;
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.userId = userId || booking.userId;
    booking.showtimeId = showtimeId || booking.showtimeId;
    booking.totalPrice = totalPrice || booking.totalPrice;
    booking.status = status || booking.status;
    booking.paymentMethod = paymentMethod || booking.paymentMethod;
    await booking.save();
    res.status(200).json({ 
        message: 'Booking updated successfully', booking 
    });
  } catch (error) {
    res.status(500).json({ message: 'updateBooking error', error: error.message });
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
    const { seatIds } = req.body; // seatIds should be showtimeSeatIds
    if (!Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ message: 'seatIds must be a non-empty array' });
    }

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const created = [];
    for (const showtimeSeatId of seatIds) {
      const exists = await BookingSeat.findOne({ where: { bookingId: id, showtimeSeatId } });
      if (exists) continue;
      const bs = await BookingSeat.create({ bookingId: id, showtimeSeatId });
      created.push(bs);
    }

    res.status(201).json({
      message: 'Seats added to booking successfully',
      added: created.length
    });
  } catch (error) {
    console.error('addSeatsToBooking error:', error); // helpful log
    res.status(500).json({ message: 'addSeatsToBooking error', error: error.message });
  }
};

// DELETE /admin/bookings/:id/seats/:seatId -> removeSeatFromBooking
exports.removeSeatFromBooking = async (req, res) => {
  try {
    const { id, seatId } = req.params; // seatId here is a showtimeSeatId
    const bookingSeat = await BookingSeat.findOne({ where: { bookingId: id, showtimeSeatId: seatId } });
    if (!bookingSeat) {
      return res.status(404).json({ message: 'Seat not found in booking' });
    }
    await bookingSeat.destroy();
    res.status(200).json({ message: 'Seat removed from booking successfully' });
  } catch (error) {
    res.status(500).json({ message: 'removeSeatFromBooking error' });
  } 
};

// GET /admin/bookings/summary -> getBookingSummary?month=&year=
exports.getBookingSummary = async (req, res) => {
  try {
    const month = req.query.month ? parseInt(req.query.month, 10) : undefined;
    const year = req.query.year ? parseInt(req.query.year, 10) : undefined;

    const whereClause = {};
    if (year && month && month >= 1 && month <= 12) {
      whereClause.createdAt = {
        [Op.gte]: new Date(year, month - 1, 1),
        [Op.lt]: new Date(year, month, 1),
      };
    } else if (year) {
      whereClause.createdAt = {
        [Op.gte]: new Date(year, 0, 1),
        [Op.lt]: new Date(year + 1, 0, 1),
      };
    }

    const totalBookings = await Booking.count({ where: whereClause });
    const totalRevenueRaw = await Booking.sum('totalPrice', { where: whereClause });
    const totalRevenue = totalRevenueRaw ?? 0;

    res.status(200).json({ totalBookings, totalRevenue });
  } catch (error) {
    res.status(500).json({ message: 'getBookingSummary error', error: error.message });
  }
}

// POST /admin/bookings/:id/foods -> addFoodsToBooking
exports.addFoodsToBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { foodComboIds } = req.body;
    if (!Array.isArray(foodComboIds) || foodComboIds.length === 0) {
      return res.status(400).json({ message: 'foodComboIds must be a non-empty array' });
    }
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    const created = [];
    for (const foodComboId of foodComboIds) {
      const exists = await BookingFood.findOne({ where: { bookingId: id, foodComboId } });
      if (exists) continue;
      const bf = await BookingFood.create({ bookingId: id, foodComboId });
      created.push(bf);
    }
    res.status(201).json({
      message: 'Food combos added to booking successfully',
      added: created.length
    });
  }
  catch (error) {
    console.error('addFoodsToBooking error:', error);
    res.status(500).json({ message: 'addFoodsToBooking error', error: error.message });
  } 
};

// DELETE /admin/bookings/:id/foods/:foodId -> removeFoodFromBooking
exports.removeFoodFromBooking = async (req, res) => {
  try {
    const { id, foodId } = req.params;
    const bookingFood = await BookingFood.findOne({ where: { bookingId: id, foodComboId: foodId } });
    if (!bookingFood) {
      return res.status(404).json({ message: 'Food combo not found in booking' });
    } 
    await bookingFood.destroy();
    res.status(200).json({ message: 'Food combo removed from booking successfully' });
  }
  catch (error) {
    res.status(500).json({ message: 'removeFoodFromBooking error' });
  }
};