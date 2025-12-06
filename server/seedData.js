const { sequelize, Cinema, Room, Seat } = require('./models');

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    // Create Cinema
    const cinema = await Cinema.create({
      name: 'CinemaVerse Center',
      address: '227 Nguyễn Văn Cừ, phường 4, quận 5, TP.HCM'
    });
    console.log('Created cinema:', cinema.name);

    // Create Room
    const room = await Room.create({
      name: 'Room 01',
      type: '2D',
      totalSeats: 20,
      cinemaId: cinema.id
    });
    console.log('Created room:', room.name);

    // Created 20 seats, 2 rows (A, B)
    const seatsData = [];
    
    // Row A: Normal
    for (let i = 1; i <= 10; i++) {
      seatsData.push({
        row: 'A',
        number: i,
        type: 'NORMAL',
        priceMultiplier: 1.0,
        roomId: room.id
      });
    }

    // Row B: VIP
    for (let i = 1; i <= 10; i++) {
      seatsData.push({
        row: 'B',
        number: i,
        type: 'VIP',
        priceMultiplier: 1.2, // 20% costs
        roomId: room.id
      });
    }

    await Seat.bulkCreate(seatsData);
    console.log('Created 20 Seats');

    process.exit();
  } catch (error) {
    console.error('Data error:', error);
    process.exit(1);
  }
};

seedDatabase();