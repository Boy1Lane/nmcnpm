// seedAll.js
require("dotenv").config();
const { sequelize, Cinema, Room, Seat, Movie } = require("./models");

async function seed() {
  try {
    console.log("🔄 Reset database...");
    await sequelize.sync({ force: true });

    // ======== SEED CINEMAS =========
    const cinemaData = [
      { name: "CinemaVerse Center", address: "227 Nguyễn Văn Cừ, Q5, TP.HCM" },
      { name: "CinemaVerse Nguyễn Trãi", address: "100 Nguyễn Trãi, Q1, TP.HCM" },
      { name: "CinemaVerse Landmark", address: "720A Điện Biên Phủ, Bình Thạnh" },
    ];

    const cinemas = await Cinema.bulkCreate(cinemaData);
    console.log(`🎬 Created ${cinemas.length} cinemas`);

    // ========= SEED ROOMS + SEATS ===========
    const rows = ["A", "B", "C", "D"];

    for (const cinema of cinemas) {
      for (let r = 1; r <= 3; r++) {
        const room = await Room.create({
          name: `Room ${r}`,
          type: r === 3 ? "IMAX" : r === 2 ? "3D" : "2D",
          totalSeats: 40,
          cinemaId: cinema.id,
        });

        const seatList = [];

        rows.forEach((row, idx) => {
          for (let i = 1; i <= 10; i++) {
            seatList.push({
              row,
              number: i,
              type: idx < 2 ? "NORMAL" : "VIP",
              priceMultiplier: idx < 2 ? 1.0 : 1.3,
              roomId: room.id,
            });
          }
        });

        await Seat.bulkCreate(seatList);
      }
    }

    console.log("💺 Created seats for all rooms");

    // ========= SEED MOVIES ==========
    const movies = [
      {
        title: "Inception",
        description: "A thief enters dreams to steal secrets.",
        director: "Christopher Nolan",
        duration: 148,
        genre: "Sci-Fi",
        releaseDate: "2010-07-16",
        posterUrl: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg"
      },
      {
        title: "Pulp Fiction",
        description: "Crime and redemption in intertwined stories.",
        director: "Quentin Tarantino",
        duration: 154,
        genre: "Crime",
        releaseDate: "1994-10-14",
        posterUrl: "https://image.tmdb.org/t/p/w500/dM2w364MScsjFf8pfMbaWUcWrR.jpg"
      },
      {
        title: "Spirited Away",
        description: "A girl enters a mystical world.",
        director: "Hayao Miyazaki",
        duration: 125,
        genre: "Animation",
        releaseDate: "2001-07-20",
        posterUrl: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg"
      }
    ];

    await Movie.bulkCreate(movies);
    console.log("🎞️ Seeded 3 movies!");

    console.log("🌱 ALL SEED DONE!");
    process.exit();
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
}

seed();
