const { Seat, ShowtimeSeat, BookingSeat } = require('../models');
const { Op } = require('sequelize');

async function cleanup() {
    try {
        console.log('Starting cleanup (Model Mode)...');

        const coupleSeats = await Seat.findAll({ where: { type: 'COUPLE' } });
        const coupleSeatIds = coupleSeats.map(s => s.id);
        console.log(`Found ${coupleSeatIds.length} COUPLE seats.`);

        if (coupleSeatIds.length > 0) {
            // Find ShowtimeSeats
            const showtimeSeats = await ShowtimeSeat.findAll({ where: { seatId: coupleSeatIds } });
            const stsIds = showtimeSeats.map(s => s.id);
            console.log(`Found ${stsIds.length} ShowtimeSeats.`);

            if (stsIds.length > 0) {
                // Delete BookingSeats
                await BookingSeat.destroy({ where: { showtimeSeatId: stsIds } });
                console.log('Deleted BookingSeats.');

                // Delete ShowtimeSeats
                await ShowtimeSeat.destroy({ where: { id: stsIds } });
                console.log('Deleted ShowtimeSeats.');
            }

            // Delete Seats
            await Seat.destroy({ where: { id: coupleSeatIds } });
            console.log('Deleted COUPLE Seats.');
        }

        console.log('Cleanup complete.');
        process.exit(0);
    } catch (error) {
        console.error('Cleanup failed:', error);
        process.exit(1);
    }
}

cleanup();
