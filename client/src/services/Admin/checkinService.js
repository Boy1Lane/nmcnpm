import bookingService from "./bookingService";
import showtimeService from "./showtimeService";
import movieService from "./movieService";
import roomService from "./roomService";
import cinemaService from "./cinemaService";

const getCheckInInfo = async (bookingId) => {
  console.log("🟡 [CHECKIN] Start getCheckInInfo", bookingId);

  // 1️⃣ BOOKING
  let booking;
  try {
    booking = (await bookingService.getBookingById(bookingId)).data;
  } catch (err) {
    console.error("🔴 [CHECKIN] Booking NOT FOUND");
    throw err;
  }

  let showtime = null;
  let movie = { title: "N/A" };
  let room = { name: "N/A", type: "N/A" };
  let cinema = { name: "N/A" };
  let roomType = "N/A"; // ✅ TÁCH RIÊNG
  let seats = [];

  try {
    // 2️⃣ SHOWTIME
    showtime = (await showtimeService.getShowtimeById(booking.showtimeId)).data;

    // 3️⃣ MOVIE
    movie = (await movieService.getMovieById(showtime.movieId)).data;

    // 4️⃣ ROOM
    room = (await roomService.getRoomById(showtime.roomId)).data;
    roomType = room.type || "N/A"; // ✅ LẤY LOẠI PHÒNG

    // 4.1️⃣ CINEMA
    if (room.cinemaId) {
      try {
        cinema = (await cinemaService.getById(room.cinemaId)).data;
      } catch {
        console.warn("🟠 [CHECKIN] Cinema error, fallback N/A");
      }
    }

    // 5️⃣ SHOWTIME SEATS
    const showtimeSeats = (
      await showtimeService.getSeatsByShowtime(showtime.id)
    ).data;

    // 6️⃣ ROOM SEATS
    const roomSeats = (await roomService.getSeats(showtime.roomId)).data;

    // 7️⃣ MAP GHẾ → A1 A2 A3
    seats = booking.seats
      .map((bs) => {
        const ss = showtimeSeats.find(
          (s) => s.id === bs.showtimeSeatId
        );
        if (!ss) return null;

        const seat = roomSeats.find((r) => r.id === ss.seatId);
        if (!seat) return null;

        return `${seat.row}${seat.number}`;
      })
      .filter(Boolean);

  } catch (err) {
    console.warn("🟠 [CHECKIN] Partial data error:", err);
  }

  return {
    booking,
    showtime,
    movie,
    room,
    cinema,
    roomType, // ✅ RETURN RÕ RÀNG
    seats,
  };
};

const checkInBooking = async (bookingId) => {
  console.log("🟡 [CHECKIN] Update booking to USED:", bookingId);
  return bookingService.checkInBooking(bookingId);
};

export default {
  getCheckInInfo,
  checkInBooking,
};
