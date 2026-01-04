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
    BookingSeat,
    Promotion, // ⭐ THÊM
    FoodCombo // ⭐ THÊM
} = require('./models');
const bcrypt = require('bcrypt');


/**
 * Random datetime trong tuần hiện tại (Thứ 2 → CN)
 */
function randomDateInThisWeek(hour, minute = 0) {
    const now = new Date();


    const monday = new Date(now);
    const day = monday.getDay() || 7;
    monday.setDate(monday.getDate() - day + 1);
    monday.setHours(0, 0, 0, 0);


    const offset = Math.floor(Math.random() * 7);
    const date = new Date(monday);
    date.setDate(monday.getDate() + offset);
    date.setHours(hour, minute, 0, 0);


    return date;
}


async function seedData() {
    try {
        console.log('🔄 Reset database...');


        // FIX ENUM cũ Postgres
        await sequelize.query('DROP TYPE IF EXISTS "enum_Bookings_status" CASCADE;');
        await sequelize.query('DROP TYPE IF EXISTS "enum_ShowtimeSeats_status" CASCADE;');


        await sequelize.sync({ force: true });
        console.log('✅ Database cleared');


        // =========================
        // USERS (30)
        // =========================
        const users = [];


        users.push(await User.create({
            fullName: 'Admin System',
            email: 'admin@test.com',
            password: await bcrypt.hash('admin123', 10),
            role: 'admin'
        }));


        users.push(await User.create({
            fullName: 'Staff Cinema',
            email: 'staff@test.com',
            password: await bcrypt.hash('staff123', 10),
            role: 'staff'
        }));


        // Test User for Development
        users.push(await User.create({
            fullName: 'Test User',
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10),
            role: 'customer'
        }));


        const commonPassword = await bcrypt.hash('123456', 10);
        for (let i = 1; i <= 28; i++) {
            users.push(await User.create({
                fullName: `Customer ${i}`,
                email: `user${i}@test.com`,
                password: commonPassword,
                phone: `09000000${i}`,
                role: 'customer'
            }));
        }


        // =========================
        // CINEMAS (5)
        // =========================
        const cinemas = [];
        const cinemaNames = [
            'CGV Nguyen Trai',
            'Lotte Cinema Q7',
            'Galaxy Tan Binh',
            'BHD Bitexco',
            'CGV Landmark 81'
        ];


        for (let i = 0; i < cinemaNames.length; i++) {
            cinemas.push(await Cinema.create({
                name: cinemaNames[i],
                address: `Address ${i + 1}, Ho Chi Minh City`
            }));
        }


        // =========================
        // ROOMS (15)
        // =========================
        const rooms = [];
        const roomTypes = ['IMAX', '3D', '2D'];


        for (const cinema of cinemas) {
            for (let i = 1; i <= 3; i++) {
                rooms.push(await Room.create({
                    name: `Room ${i}`,
                    type: roomTypes[i % 3],
                    totalSeats: 20,
                    cinemaId: cinema.id
                }));
            }
        }


        // =========================
        // SEATS
        // =========================
        async function createSeats(room) {
            const rows = ['A', 'B', 'C', 'D'];
            const cols = 5;


            for (let r = 0; r < rows.length; r++) {
                for (let c = 1; c <= cols; c++) {
                    await Seat.create({
                        roomId: room.id,
                        row: rows[r],
                        number: c,
                        type: r === 0 ? 'VIP' : 'NORMAL',
                        priceMultiplier: r === 0 ? 1.3 : 1.0
                    });
                }
            }
        }


        for (const room of rooms) {
            await createSeats(room);
        }


        // =========================
        // MOVIES (10) - Stable posters (TMDB) & trailers
        // =========================
        const movies = [];


        const movieData = [
            {
                title: 'Avengers Endgame',
                genre: 'Action',
                duration: 181,
                posterUrl: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
                trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c'
            },
            {
                title: 'Dune Part Two',
                genre: 'Sci-Fi',
                duration: 166,
                posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
                trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w'
            },
            {
                title: 'Kung Fu Panda 4',
                genre: 'Animation',
                duration: 94,
                posterUrl: 'https://www.themoviedb.org/t/p/w1280/7quq3UOaaB0qNM7TMGMEqqghLck.jpg',
                trailerUrl: 'https://www.youtube.com/watch?v=_inKs4eeHiI'
            },
            {
                title: 'Batman',
                genre: 'Action',
                duration: 176,
                posterUrl: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
                trailerUrl: 'https://www.youtube.com/watch?v=mqqft2x_Aa4'
            },
            {
                title: 'Spider-Man',
                genre: 'Action',
                duration: 121,
                posterUrl: 'https://image.tmdb.org/t/p/w500/rweIrveL43TaxUN0akQEaAXL6x0.jpg',
                trailerUrl: 'https://www.youtube.com/watch?v=t06RUxPbp_c'
            },
            {
                title: 'Doctor Strange',
                genre: 'Sci-Fi',
                duration: 115,
                posterUrl: 'https://image.tmdb.org/t/p/w500/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg',
                trailerUrl: 'https://www.youtube.com/watch?v=HSzx-zryEgM'
            },
            {
                title: 'Avatar: The Way of Water',
                genre: 'Sci-Fi',
                duration: 192,
                posterUrl: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
                trailerUrl: 'https://www.youtube.com/watch?v=d9MyW72ELq0'
            },
            {
                title: 'Fast X',
                genre: 'Action',
                duration: 141,
                posterUrl: 'https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg',
                trailerUrl: 'https://www.youtube.com/watch?v=32RAq6JzY-w'
            },
            {
                title: 'John Wick: Chapter 4',
                genre: 'Action',
                duration: 169,
                posterUrl: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
                trailerUrl: 'https://www.youtube.com/watch?v=qEVUtrk8_B4'
            },
            {
                title: 'Oppenheimer',
                genre: 'Drama',
                duration: 180,
                posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
                trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg'
            }
        ];


        for (let i = 0; i < movieData.length; i++) {
            movies.push(await Movie.create({
                ...movieData[i],
                releaseDate: '2024-01-01',
                status: i < 7 ? 'showing' : 'coming_soon'
            }));
        }


        // =========================
        // SHOWTIMES (rải đều trong tuần)
        // =========================
        function createTime(startHour, duration) {
            const start = randomDateInThisWeek(startHour);
            const end = new Date(start.getTime() + duration * 60000);
            return { start, end };
        }


        const showtimes = [];


        for (const room of rooms) {
            for (let i = 0; i < 2; i++) {
                const movie = movies[(room.id + i) % movies.length];
                const t = createTime(9 + i * 4, movie.duration);


                showtimes.push(await Showtime.create({
                    movieId: movie.id,
                    roomId: room.id,
                    startTime: t.start,
                    endTime: t.end,
                    basePrice: 100000 + i * 20000
                }));
            }
        }


        // =========================
        // SHOWTIME SEATS
        // =========================
        const allSeats = await Seat.findAll();


        for (const showtime of showtimes) {
            const seats = allSeats.filter(s => s.roomId === showtime.roomId);


            for (const seat of seats) {
                await ShowtimeSeat.create({
                    showtimeId: showtime.id,
                    seatId: seat.id,
                    status: 'AVAILABLE',
                    price: Math.round(showtime.basePrice * seat.priceMultiplier)
                });
            }
        }


        // =========================
        // BOOKINGS (20) - ngày mua rải đều
        // =========================
        const customers = users.filter(u => u.role === 'customer');


        for (let i = 0; i < 20; i++) {
            const customer = customers[i];
            const showtime = showtimes[i];


            const sts = await ShowtimeSeat.findAll({
                where: {
                    showtimeId: showtime.id,
                    status: 'AVAILABLE'
                },
                limit: Math.floor(Math.random() * 3) + 1 // 1–3 ghế
            });


            const bookingDate = randomDateInThisWeek(
                Math.floor(Math.random() * 10) + 8 // 8h → 18h
            );


            const totalPrice = sts.reduce((sum, s) => sum + s.price, 0);


            const booking = await Booking.create({
                userId: customer.id,
                showtimeId: showtime.id,
                totalPrice,
                status: 'CONFIRMED',
                paymentMethod: i % 2 === 0 ? 'CREDIT_CARD' : 'CASH',
                createdAt: bookingDate,
                updatedAt: bookingDate
            });


            for (const seat of sts) {
                await BookingSeat.create({
                    bookingId: booking.id,
                    showtimeSeatId: seat.id
                });


                seat.status = 'SOLD';
                await seat.save();
            }
        }
        // =========================
        // PROMOTIONS
        // =========================
        await Promotion.bulkCreate([
            {
                code: 'SALE10',
                description: 'Giảm 10% cho mọi đơn vé',
                discountPercentage: 10,
                validFrom: new Date('2025-01-01'),
                validTo: new Date('2025-12-31'),
                usageLimit: 100,
                timesUsed: 0
            },
            {
                code: 'SALE20',
                description: 'Giảm 20% vé cuối tuần',
                discountPercentage: 20,
                validFrom: new Date('2025-01-01'),
                validTo: new Date('2025-06-30'),
                usageLimit: 50,
                timesUsed: 0
            },
            {
                code: 'NEWUSER15',
                description: 'Khuyến mãi cho khách hàng mới',
                discountPercentage: 15,
                validFrom: new Date('2025-01-01'),
                validTo: new Date('2025-12-31'),
                usageLimit: null, // không giới hạn
                timesUsed: 0
            }
        ]);
        console.log('🎁 Promotions seeded');


        // =========================
        // FOOD COMBOS (Picsum - static image IDs)
        // =========================
        await FoodCombo.bulkCreate([
            {
                name: 'Popcorn (L)',
                price: 50000,
                items: '1 Large Popcorn',
                pictureUrl: 'https://images.pexels.com/photos/33129/popcorn-movie-party-entertainment.jpg'
            },
            {
                name: 'Coke (L)',
                price: 30000,
                items: '1 Large Coke',
                pictureUrl: 'https://images.pexels.com/photos/8879611/pexels-photo-8879611.jpeg'
            },
            {
                name: 'Combo 1',
                price: 75000,
                items: '1 Popcorn (M) + 1 Coke (M)',
                pictureUrl: 'https://images.pexels.com/photos/8610548/pexels-photo-8610548.jpeg'
            },
            {
                name: 'Combo 2',
                price: 140000,
                items: '2 Popcorn (M) + 2 Coke (M)',
                pictureUrl: 'https://images.pexels.com/photos/7234391/pexels-photo-7234391.jpeg'
            }
        ]);


        console.log('🍿 Food Combos seeded');




        // =========================
        // PROMOTIONS (Additional)
        // =========================
        await Promotion.bulkCreate([
            {
                code: 'SUMMER2025',
                description: 'Summer Sale 10%',
                discountPercentage: 10,
                validFrom: new Date(),
                validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                usageLimit: 100,
                timesUsed: 0
            },
            {
                code: 'WELCOME',
                description: 'Welcome New User 20%',
                discountPercentage: 20,
                validFrom: new Date(),
                validTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                usageLimit: 50,
                timesUsed: 0
            }
        ]);
        console.log('🎁 Promotions seeded');


        console.log('🎉 SEED DATA CREATED SUCCESSFULLY');
        process.exit(0);


    } catch (err) {
        console.error('❌ SEED ERROR:', err);
        process.exit(1);
    }
}


seedData();

