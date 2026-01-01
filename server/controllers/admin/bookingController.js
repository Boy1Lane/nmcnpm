const Booking = require('../../models/Booking');
const BookingSeat = require('../../models/BookingSeat');
const BookingFood = require('../../models/BookingFood');
const ShowtimeSeat = require('../../models/ShowtimeSeat');
const Showtime = require('../../models/Showtime');
const sequelize = require('../../config/db');
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
  const transaction = await sequelize.transaction();
  try {
    const { userId, showtimeId, paymentMethod, status, seatIds } = req.body;

    if (!userId || !showtimeId) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Missing required fields!' });
    }

    if (!Array.isArray(seatIds) || seatIds.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'seatIds must be a non-empty array' });
    }

    const showtime = await Showtime.findByPk(showtimeId, { transaction });
    if (!showtime) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Showtime not found' });
    }

    // Admin API historically might pass either physical Seat IDs (like user API)
    // or ShowtimeSeat IDs. Prefer Seat IDs; fallback to ShowtimeSeat IDs.
    let showtimeSeats = await ShowtimeSeat.findAll({
      where: {
        showtimeId,
        seatId: seatIds
      },
      lock: transaction.LOCK.UPDATE,
      transaction
    });

    if (showtimeSeats.length !== seatIds.length) {
      showtimeSeats = await ShowtimeSeat.findAll({
        where: {
          showtimeId,
          id: seatIds
        },
        lock: transaction.LOCK.UPDATE,
        transaction
      });
    }

    if (showtimeSeats.length !== seatIds.length) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Invalid seat IDs for this showtime.' });
    }

    const unavailable = showtimeSeats.some((seat) => seat.status !== 'AVAILABLE');
    if (unavailable) {
      await transaction.rollback();
      return res.status(409).json({ message: 'One or more seats are already booked or held.' });
    }

    const calculatedTotal = showtimeSeats.reduce((sum, seat) => sum + seat.price, 0);

    // Create booking as PENDING (hold seats) like user flow
    const newBooking = await Booking.create({
      userId,
      showtimeId,
      totalPrice: calculatedTotal,
      paymentMethod: paymentMethod || null,
      status: 'PENDING',
      bookingDate: new Date()
    }, { transaction });

    // Lock seats
    await ShowtimeSeat.update({
      status: 'LOCKED',
      lockedAt: new Date()
    }, {
      where: {
        id: showtimeSeats.map((s) => s.id)
      },
      transaction
    });

    await BookingSeat.bulkCreate(
      showtimeSeats.map((sts) => ({
        bookingId: newBooking.id,
        showtimeSeatId: sts.id
      })),
      { transaction }
    );

    // Backward compatible: allow admin to create and immediately confirm in one request.
    if (status === 'CONFIRMED') {
      newBooking.status = 'CONFIRMED';
      await newBooking.save({ transaction });

      await ShowtimeSeat.update({
        status: 'SOLD',
        lockedAt: null
      }, {
        where: { id: showtimeSeats.map((s) => s.id) },
        transaction
      });
    }

    await transaction.commit();

    res.status(201).json({
      message: status === 'CONFIRMED'
        ? 'Booking created and confirmed successfully!'
        : 'Seats held successfully. Please confirm booking to finalize.',
      data: newBooking
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /admin/bookings/confirm -> confirmBooking
exports.confirmBooking = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { bookingId, promotionId, discountAmount, paymentMethod } = req.body;
    if (!bookingId) {
      await transaction.rollback();
      return res.status(400).json({ message: 'bookingId is required' });
    }

    const booking = await Booking.findOne({
      where: { id: bookingId, status: 'PENDING' },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Booking not found or already processed.' });
    }

    // Recompute seat total to be safe
    const bookingSeats = await BookingSeat.findAll({ where: { bookingId: booking.id }, transaction });
    let seatTotal = 0;
    if (bookingSeats.length > 0) {
      const seatIds = bookingSeats.map((bs) => bs.showtimeSeatId);
      const seats = await ShowtimeSeat.findAll({ where: { id: seatIds }, transaction });
      seatTotal = seats.reduce((sum, s) => sum + (s.price || 0), 0);
    }

    // Compute food total from BookingFood joined with FoodCombo
    const BookingFoodModel = BookingFood;
    const FoodCombo = require('../../models/FoodCombo');
    const bookingFoods = await BookingFoodModel.findAll({ where: { bookingId: booking.id }, transaction });
    let foodTotal = 0;
    if (bookingFoods.length > 0) {
      const foodComboIds = bookingFoods.map((bf) => bf.foodComboId);
      const combos = await FoodCombo.findAll({ where: { id: foodComboIds }, transaction });
      const comboMap = {};
      combos.forEach((c) => (comboMap[c.id] = c));
      bookingFoods.forEach((bf) => {
        const combo = comboMap[bf.foodComboId];
        if (combo) {
          foodTotal += (combo.price || 0) * (bf.quantity || 0);
        }
      });
    }

    // Apply promotion if provided (do not accept negative discount)
    let discount = 0;
    if (promotionId && Number(discountAmount) > 0) {
      discount = Math.max(0, Number(discountAmount));
      // increment timesUsed
      const Promotion = require('../../models/Promotion');
      const promotion = await Promotion.findByPk(promotionId, { transaction, lock: transaction.LOCK.UPDATE });
      if (promotion) {
        promotion.timesUsed = (promotion.timesUsed || 0) + 1;
        await promotion.save({ transaction });
        booking.promotionId = promotionId;
      }
    }

    // Final total
    const finalTotal = Math.max(0, seatTotal + foodTotal - discount);

    booking.totalPrice = finalTotal;
    booking.discountAmount = discount;
    if (paymentMethod) {
    booking.paymentMethod = paymentMethod;
  }
    booking.status = 'CONFIRMED';
    await booking.save({ transaction });

    // Update seats to SOLD
    const showtimeSeatIds = bookingSeats.map((bs) => bs.showtimeSeatId);
    if (showtimeSeatIds.length > 0) {
      await ShowtimeSeat.update({ status: 'SOLD', lockedAt: null }, { where: { id: showtimeSeatIds }, transaction });
    }

    await transaction.commit();
    res.json({ message: 'Booking confirmed successfully.', booking });
  } catch (error) {
    await transaction.rollback();
    console.error('Admin confirm booking error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// POST /admin/bookings/:bookingId/cancel -> cancelBooking
exports.cancelBooking = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const bookingId = req.params.bookingId;

    const booking = await Booking.findOne({
      where: { id: bookingId, status: 'PENDING' },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Booking not found or already processed.' });
    }

    booking.status = 'CANCELLED';
    await booking.save({ transaction });

    const bookingSeats = await BookingSeat.findAll({
      where: { bookingId: booking.id },
      transaction
    });

    const showtimeSeatIds = bookingSeats.map((bs) => bs.showtimeSeatId);
    if (showtimeSeatIds.length > 0) {
      await ShowtimeSeat.update({
        status: 'AVAILABLE',
        lockedAt: null
      }, {
        where: { id: showtimeSeatIds },
        transaction
      });
    }

    await transaction.commit();
    res.json({ message: 'Booking cancelled successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Admin cancel booking error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
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
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id, {
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Booking not found' });
    }

    const bookingSeats = await BookingSeat.findAll({
      where: { bookingId: booking.id },
      transaction
    });

    const showtimeSeatIds = bookingSeats.map((bs) => bs.showtimeSeatId);

    if (showtimeSeatIds.length > 0) {
      await ShowtimeSeat.update({
        status: 'AVAILABLE',
        lockedAt: null
      }, {
        where: { id: showtimeSeatIds },
        transaction
      });
    }

    // Clean up child records explicitly (do not rely on DB cascade)
    await BookingSeat.destroy({ where: { bookingId: booking.id }, transaction });
    await BookingFood.destroy({ where: { bookingId: booking.id }, transaction });
    await booking.destroy({ transaction });

    await transaction.commit();
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'deleteBooking error', error: error.message });
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
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    // accept { foodComboIds: [1,2] } or { foodCombos: [{ foodComboId, quantity }] }
    const { foodComboIds, foodCombos } = req.body;

    if ((!Array.isArray(foodComboIds) || foodComboIds.length === 0) && (!Array.isArray(foodCombos) || foodCombos.length === 0)) {
      await transaction.rollback();
      return res.status(400).json({ message: 'foodComboIds or foodCombos is required and must be a non-empty array' });
    }

    const booking = await Booking.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Booking not found' });
    }

    const FoodCombo = require('../../models/FoodCombo');
    let added = 0;
    let addedAmount = 0;

    if (Array.isArray(foodComboIds) && foodComboIds.length > 0) {
      const combos = await FoodCombo.findAll({ where: { id: foodComboIds }, transaction });
      const comboMap = {};
      combos.forEach((c) => (comboMap[c.id] = c));
      for (const fcId of foodComboIds) {
        const combo = comboMap[fcId];
        if (!combo) continue;
        const exists = await BookingFood.findOne({ where: { bookingId: id, foodComboId: fcId }, transaction });
        if (exists) {
          exists.quantity = (exists.quantity || 0) + 1;
          await exists.save({ transaction });
        } else {
          await BookingFood.create({ bookingId: id, foodComboId: fcId, quantity: 1 }, { transaction });
          added += 1;
        }
        addedAmount += combo.price || 0;
      }
    }

    if (Array.isArray(foodCombos) && foodCombos.length > 0) {
      const ids = foodCombos.map((f) => f.foodComboId || f.id);
      const combos = await FoodCombo.findAll({ where: { id: ids }, transaction });
      const comboMap = {};
      combos.forEach((c) => (comboMap[c.id] = c));
      for (const item of foodCombos) {
        const fcId = item.foodComboId || item.id;
        const qty = Number(item.quantity) || 0;
        if (!fcId || qty <= 0) continue;
        const combo = comboMap[fcId];
        if (!combo) continue;
        const exists = await BookingFood.findOne({ where: { bookingId: id, foodComboId: fcId }, transaction });
        if (exists) {
          exists.quantity = (exists.quantity || 0) + qty;
          await exists.save({ transaction });
        } else {
          await BookingFood.create({ bookingId: id, foodComboId: fcId, quantity: qty }, { transaction });
          added += 1;
        }
        addedAmount += (combo.price || 0) * qty;
      }
    }

    // Update booking totalPrice
    if (addedAmount > 0) {
      booking.totalPrice = (booking.totalPrice || 0) + addedAmount;
      await booking.save({ transaction });
    }

    await transaction.commit();
    res.status(201).json({ message: 'Food combos processed', added, addedAmount });
  } catch (error) {
    await transaction.rollback();
    console.error('addFoodsToBooking error:', error);
    res.status(500).json({ message: 'addFoodsToBooking error', error: error.message });
  }
};

// DELETE /admin/bookings/:id/foods/:foodId -> removeFoodFromBooking
exports.removeFoodFromBooking = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id, foodId } = req.params;
    const bookingFood = await BookingFood.findOne({ where: { bookingId: id, foodComboId: foodId }, transaction, lock: transaction.LOCK.UPDATE });
    if (!bookingFood) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Food combo not found in booking' });
    }

    const FoodCombo = require('../../models/FoodCombo');
    const combo = await FoodCombo.findByPk(foodId, { transaction });
    const amount = (combo?.price || 0) * (bookingFood.quantity || 0);

    await bookingFood.destroy({ transaction });

    // adjust booking total
    const booking = await Booking.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
    if (booking) {
      booking.totalPrice = Math.max(0, (booking.totalPrice || 0) - amount);
      await booking.save({ transaction });
    }

    await transaction.commit();
    res.status(200).json({ message: 'Food combo removed from booking successfully', removedAmount: amount });
  } catch (error) {
    await transaction.rollback();
    console.error('removeFoodFromBooking error:', error);
    res.status(500).json({ message: 'removeFoodFromBooking error', error: error.message });
  }
};