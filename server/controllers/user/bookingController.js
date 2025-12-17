const { Booking, BookingSeat, Showtime, Seat, Movie, Cinema, Room, ShowtimeSeat } = require('../../models');
const sequelize = require('../../config/db');

exports.createBooking = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { showtimeId, seatIds, paymentMethod } = req.body;
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

    // Calculate Total Price
    const calculatedTotal = showtimeSeats.reduce((sum, seat) => sum + seat.price, 0);

    // Create the Booking (PENDING)
    const booking = await Booking.create({
      userId,
      showtimeId,
      totalPrice: calculatedTotal,
      paymentMethod,
      status: 'PENDING', // Initial status
      bookingDate: new Date()
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
        { model: Showtime, include: [Movie] }
      ]
    });

    res.status(201).json({ 
      message: 'Seats held successfully. Please proceed to payment.', 
      booking: completeBooking 
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Booking error:', error);
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

exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        {
          model: Showtime,
          attributes: ['startTime', 'endTime', 'price'],
          include: [
            { model: Movie, attributes: ['title', 'posterUrl', 'duration'] },
            { 
              model: Room, 
              attributes: ['name'],
              include: [{ model: Cinema, attributes: ['name', 'location'] }]
            }
          ]
        },
        {
          model: BookingSeat,
          include: [{ model: Seat, attributes: ['row', 'number', 'type'] }]
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