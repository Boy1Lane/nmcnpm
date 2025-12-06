const Showtime = require('../models/Showtime');
const Room = require('../models/Room');
const Seat = require('../models/Seat');
const ShowtimeSeat = require('../models/ShowtimeSeat');
const Movie = require('../models/Movie')

exports.createShowtime = async (req, res) => {
    try {
        const { movieId, roomId, startTime, basePrice } = req.body;
        
        const room = await Room.findByPk(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const movie = await Movie.findByPk(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        const movieDuration = movie.duration;
        const endTime = new Date(new Date(startTime).getTime() + movieDuration * 60000);

        const newShowtime = await Showtime.create({
            movieId,
            roomId,
            startTime,
            endTime,
            basePrice
        });
        
        // Generating ShowtimeSeat for this Showtime
        const seats = await Seat.findAll({ where: { roomId } });
        
        if (seats.length === 0) {
            return res.status(201).json({
                message: 'Showtime created, but no seats found in this room to generate ShowtimeSeats.',
                showtime: newShowtime
            });
        }

        const showtimeSeatsData = seats.map(seat => ({
            showtimeId: newShowtime.id,
            seatId: seat.id,
            status: 'AVAILABLE',
            price: basePrice * seat.priceMultiplier 
        }));
        
        await ShowtimeSeat.bulkCreate(showtimeSeatsData);

        res.status(201).json({
            message: `Successfully created Showtime and generated ${showtimeSeatsData.length} seats.`,
            showtime: newShowtime
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }

}