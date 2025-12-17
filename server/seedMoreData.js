const {
  sequelize,
  User,
  Movie,
  Cinema,
  Room,
  Seat,
  Showtime,
  ShowtimeSeat,
  Booking,
  BookingSeat
} = require('./models');

async function seedData() {
  try {
    console.log('🔄 Reset database...');
    await sequelize.sync({ force: true });
    console.log('✅ Database cleared');

    // =========================
    // USERS
    // =========================
    const admin = await User.create({
      fullName: 'Admin System',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin'
    });

    const staff = await User.create({
      fullName: 'Staff Cinema',
      email: 'staff@test.com',
      password: 'staff123',
      role: 'staff'
    });

    const customer = await User.create({
      fullName: 'Nguyen Van A',
      email: 'user@test.com',
      password: '123456',
      phone: '0123456789',
      role: 'customer'
    });

    // =========================
    // CINEMAS
    // =========================
    const cinema1 = await Cinema.create({
      name: 'CGV Nguyen Trai',
      address: '1 Nguyen Trai, HCM'
    });

    const cinema2 = await Cinema.create({
      name: 'Lotte Cinema Q7',
      address: 'Lotte Mart Q7, HCM'
    });

    // =========================
    // ROOMS
    // =========================
    const room1 = await Room.create({
      name: 'Room 01',
      type: 'IMAX',
      totalSeats: 20,
      cinemaId: cinema1.id
    });

    const room2 = await Room.create({
      name: 'Room 02',
      type: '3D',
      totalSeats: 16,
      cinemaId: cinema1.id
    });

    const room3 = await Room.create({
      name: 'Room 01',
      type: '2D',
      totalSeats: 12,
      cinemaId: cinema2.id
    });

    // =========================
    // SEATS
    // =========================
    async function createSeats(room, rows, cols) {
      const seats = [];
      for (let r = 0; r < rows.length; r++) {
        for (let c = 1; c <= cols; c++) {
          seats.push(await Seat.create({
            roomId: room.id,
            row: rows[r],
            number: c,
            type: r === 0 ? 'VIP' : 'NORMAL',
            priceMultiplier: r === 0 ? 1.3 : 1.0
          }));
        }
      }
      return seats;
    }

    const seatsRoom1 = await createSeats(room1, ['A', 'B'], 10);
    const seatsRoom2 = await createSeats(room2, ['A', 'B'], 8);
    const seatsRoom3 = await createSeats(room3, ['A', 'B'], 6);

    // =========================
    // MOVIES
    // =========================
    const movie1 = await Movie.create({
      title: 'Avengers: Endgame',
      genre: 'Action',
      duration: 180,
      releaseDate: '2019-04-26',
      status: 'showing'
    });

    const movie2 = await Movie.create({
      title: 'Dune: Part Two',
      genre: 'Sci-Fi',
      duration: 165,
      releaseDate: '2024-03-01',
      status: 'showing'
    });

    const movie3 = await Movie.create({
      title: 'Kung Fu Panda 4',
      genre: 'Animation',
      duration: 95,
      releaseDate: '2024-06-01',
      status: 'coming_soon'
    });

    // =========================
    // SHOWTIMES
    // =========================
    function createTime(startHour, duration) {
      const start = new Date();
      start.setHours(startHour, 0, 0, 0);
      const end = new Date(start.getTime() + duration * 60000);
      return { start, end };
    }

    const t1 = createTime(9, movie1.duration);
    const t2 = createTime(13, movie2.duration);
    const t3 = createTime(18, movie1.duration);

    const showtime1 = await Showtime.create({
      movieId: movie1.id,
      roomId: room1.id,
      startTime: t1.start,
      endTime: t1.end,
      basePrice: 120000
    });

    const showtime2 = await Showtime.create({
      movieId: movie2.id,
      roomId: room1.id,
      startTime: t2.start,
      endTime: t2.end,
      basePrice: 130000
    });

    const showtime3 = await Showtime.create({
      movieId: movie1.id,
      roomId: room2.id,
      startTime: t3.start,
      endTime: t3.end,
      basePrice: 100000
    });

    // =========================
    // SHOWTIME SEATS
    // =========================
    async function createShowtimeSeats(showtime, seats) {
      const result = [];
      for (const seat of seats) {
        result.push(await ShowtimeSeat.create({
          showtimeId: showtime.id,
          seatId: seat.id,
          status: 'AVAILABLE',
          price: Math.round(showtime.basePrice * seat.priceMultiplier)
        }));
      }
      return result;
    }

    const sts1 = await createShowtimeSeats(showtime1, seatsRoom1);
    await createShowtimeSeats(showtime2, seatsRoom1);
    await createShowtimeSeats(showtime3, seatsRoom2);

    // =========================
    // BOOKING + BOOKING SEAT
    // =========================
    const booking = await Booking.create({
      userId: customer.id,
      showtimeId: showtime1.id,
      totalPrice: sts1[0].price + sts1[1].price,
      status: 'confirmed',
      paymentMethod: 'momo'
    });

    await BookingSeat.bulkCreate([
      { bookingId: booking.id, showtimeSeatId: sts1[0].id },
      { bookingId: booking.id, showtimeSeatId: sts1[1].id }
    ]);

    sts1[0].status = 'SOLD';
    sts1[1].status = 'SOLD';
    await sts1[0].save();
    await sts1[1].save();

    console.log('🎉 FULL SEED DATA CREATED SUCCESSFULLY');
    process.exit(0);

  } catch (err) {
    console.error('❌ SEED ERROR:', err);
    process.exit(1);
  }
}

seedData();
