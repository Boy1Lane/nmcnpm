const cron = require('node-cron');
const { Op } = require('sequelize');
const { Booking, BookingSeat, ShowtimeSeat, sequelize } = require('../models');

// Configuration: How long to hold seats (in minutes)
const HOLD_TIME_MINUTES = 5;

const startCleanupJob = () => {
  // Run every minute: '*/1 * * * *'
  cron.schedule('*/1 * * * *', async () => {
    console.log('Running auto-release cleanup job...');
    const transaction = await sequelize.transaction();

    try {
      // 1. Calculate the expiration time (Now - HOLD_TIME)
      const expirationTime = new Date(Date.now() - HOLD_TIME_MINUTES * 60 * 1000);

      // 2. Find all PENDING bookings older than the expiration time
      const expiredBookings = await Booking.findAll({
        where: {
          status: 'PENDING',
          createdAt: {
            [Op.lt]: expirationTime
          }
        },
        transaction,
        lock: transaction.LOCK.UPDATE // Lock only the Booking rows
      });

      if (expiredBookings.length === 0) {
        await transaction.commit();
        return; 
      }

      console.log(`Found ${expiredBookings.length} expired bookings.`);

      const bookingIdsToCancel = expiredBookings.map(b => b.id);

      // 3. Fetch the associated seats in a separate query
      const associatedBookingSeats = await BookingSeat.findAll({
        where: {
          bookingId: bookingIdsToCancel
        },
        attributes: ['showtimeSeatId'],
        transaction
      });

      const allShowtimeSeatIds = associatedBookingSeats.map(bs => bs.showtimeSeatId);

      // 4. Update Booking Statuses to 'CANCELLED'
      await Booking.update(
        { status: 'CANCELLED' },
        { 
          where: { id: bookingIdsToCancel },
          transaction 
        }
      );

      // 5. Release Seats (Set back to AVAILABLE)
      if (allShowtimeSeatIds.length > 0) {
        await ShowtimeSeat.update(
          { 
            status: 'AVAILABLE',
            lockedAt: null 
          },
          { 
            where: { id: allShowtimeSeatIds },
            transaction 
          }
        );
      }

      await transaction.commit();
      console.log(`Successfully cancelled ${bookingIdsToCancel.length} bookings and released ${allShowtimeSeatIds.length} seats.`);

    } catch (error) {
      await transaction.rollback();
      console.error('Error in cleanup job:', error);
    }
  });
};

module.exports = startCleanupJob;