const { Booking, BookingSeat, Showtime, Seat, Movie, Cinema, Room, ShowtimeSeat, FoodCombo, BookingFood, Promotion } = require('../../models');
const sequelize = require('../../config/db');
const { Op } = require('sequelize');

exports.createBooking = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { showtimeId, seatIds, paymentMethod, foodItems, promotionCode } = req.body;
    const userId = req.user.id; // Extracted from auth middleware

    // Validate Showtime
    const showtime = await Showtime.findByPk(showtimeId);
    if (!showtime) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Showtime not found' });
    }

    // Find ShowtimeSeats and Lock them for update
    const showtimeSeats = await ShowtimeSeat.findAll({
      where: {
        showtimeId,
        seatId: seatIds
      },
      lock: transaction.LOCK.UPDATE, // Prevent race conditions
      transaction
    });

    if (showtimeSeats.length !== seatIds.length) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Invalid seat IDs for this showtime.' });
    }

    // Check if any seat is not AVAILABLE
    const unavailable = showtimeSeats.some(seat => seat.status !== 'AVAILABLE');
    if (unavailable) {
      await transaction.rollback();
      return res.status(409).json({ message: 'One or more seats are already booked or held.' });
    }

    // Calculate Seat Total
    const seatTotal = showtimeSeats.reduce((sum, seat) => sum + seat.price, 0);

    // Calculate Food Total
    let foodTotal = 0;
    const bookingFoodData = [];

    if (foodItems && foodItems.length > 0) {
      for (const item of foodItems) {
        const food = await FoodCombo.findByPk(item.foodId);
        if (!food) {
          await transaction.rollback();
          return res.status(404).json({ message: `Food item with ID ${item.foodId} not found` });
        }
        foodTotal += food.price * item.quantity;
        bookingFoodData.push({
          foodComboId: food.id,
          quantity: item.quantity
          // price: food.price removed to avoid 500 if model doesn't support it
        });
      }
    }

    // Handle Promotion
    let discountAmount = 0;
    let promotionId = null;

    if (promotionCode) {
      const promotion = await Promotion.findOne({
        where: {
          code: promotionCode,
          validFrom: { [Op.lte]: new Date() },
          validTo: { [Op.gte]: new Date() }
        },
        transaction
      });

      if (!promotion) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Invalid or expired promotion code' });
      }

      if (promotion.usageLimit && promotion.timesUsed >= promotion.usageLimit) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Promotion usage limit reached' });
      }

      // Calculate discount
      const subtotal = seatTotal + foodTotal;
      discountAmount = (subtotal * promotion.discountPercentage) / 100;
      promotionId = promotion.id;

      // Update promotion usage
      await promotion.increment('timesUsed', { transaction });
    }

    const finalTotal = seatTotal + foodTotal - discountAmount;

    // Create the Booking (PENDING)
    const booking = await Booking.create({
      userId,
      showtimeId,
      totalPrice: finalTotal > 0 ? finalTotal : 0, // Ensure non-negative
      paymentMethod,
      status: 'PENDING', // Initial status
      bookingDate: new Date(),
      promotionId,
      discountAmount
    }, { transaction });

    // Update ShowtimeSeats to LOCKED
    await ShowtimeSeat.update({
      status: 'LOCKED',
      lockedAt: new Date()
    }, {
      where: {
        id: showtimeSeats.map(s => s.id)
      },
      transaction
    });

    // Create BookingSeat entries
    const bookingSeatsData = showtimeSeats.map(sts => ({
      bookingId: booking.id,
      showtimeSeatId: sts.id,
      price: sts.price
    }));

    await BookingSeat.bulkCreate(bookingSeatsData, { transaction });

    // Create BookingFood entries
    if (bookingFoodData.length > 0) {
      const foodDataWithBookingId = bookingFoodData.map(f => ({
        ...f,
        bookingId: booking.id
      }));
      await BookingFood.bulkCreate(foodDataWithBookingId, { transaction });
    }

    await transaction.commit();

    // Fetch the complete booking with details to return
    const completeBooking = await Booking.findByPk(booking.id, {
      include: [
        {
          model: BookingSeat,
          include: [{
            model: ShowtimeSeat,
            include: [Seat]
          }]
        },
        { model: BookingFood, include: [FoodCombo] },
        { model: Showtime, include: [Movie] }
      ]
    });

    res.status(201).json({
      message: 'Booking created successfully. Please proceed to payment.',
      booking: completeBooking
    });

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('#################### BOOKING ERROR ####################');
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Request Body:', req.body);
    console.error('#######################################################');
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.confirmBooking = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { bookingId } = req.body;
    const userId = req.user.id;

    const booking = await Booking.findOne({
      where: { id: bookingId, userId, status: 'PENDING' },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Booking not found or already processed.' });
    }

    // Update Booking to CONFIRMED
    booking.status = 'CONFIRMED';
    await booking.save({ transaction });

    // Find BookingSeats to get ShowtimeSeatIds
    const bookingSeats = await BookingSeat.findAll({
      where: { bookingId: booking.id },
      transaction
    });

    const showtimeSeatIds = bookingSeats.map(bs => bs.showtimeSeatId);

    // Update ShowtimeSeats to SOLD
    await ShowtimeSeat.update({
      status: 'SOLD',
      lockedAt: null // Clear lock time or keep it as sold time
    }, {
      where: { id: showtimeSeatIds },
      transaction
    });

    await transaction.commit();

    res.json({ message: 'Booking confirmed successfully.', booking });

  } catch (error) {
    await transaction.rollback();
    console.error('Confirm booking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.cancelBooking = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const bookingId = req.params.bookingId;
    const userId = req.user.id;

    // Find the booking
    const booking = await Booking.findOne({
      where: { id: bookingId, userId, status: 'PENDING' },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Allow cancellation if PENDING or CONFIRMED (depending on policy)
    if (booking.status === 'CANCELLED') {
      await transaction.rollback();
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // 1. Update Booking Status
    booking.status = 'CANCELLED';
    await booking.save({ transaction });

    const bookingSeats = await BookingSeat.findAll({
      where: { bookingId: booking.id },
      transaction
    });

    // 2. Release Seats 
    const showtimeSeatIds = bookingSeats.map(bs => bs.showtimeSeatId);

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
    res.json({ message: 'Booking cancelled successfully' });

  } catch (error) {
    await transaction.rollback();
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        {
          model: Showtime,
          attributes: ['startTime', 'endTime', 'basePrice'],
          include: [
            { model: Movie, attributes: ['title', 'posterUrl', 'duration'] },
            {
              model: Room,
              attributes: ['name'],
              include: [{
                model: Cinema,
                attributes: ['name', 'address']
              }]
            }
          ]
        },
        {
          model: BookingSeat,
          include: [
            {
              model: ShowtimeSeat,
              include: [
                {
                  model: Seat,
                  attributes: ['row', 'number', 'type']
                }
              ]
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};