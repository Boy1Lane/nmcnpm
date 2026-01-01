const { Op } = require("sequelize");
const { Booking, BookingSeat, Showtime } = require("../../models");

exports.getTodayBookingStats = async (req, res) => {
  try {
    // ===== TIME RANGE HÔM NAY =====
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // ===== 1. SUẤT CHIẾU HÔM NAY =====
    const totalShowtimes = await Showtime.count({
      where: {
        startTime: {
          [Op.between]: [start, end],
        },
      },
    });

    // ===== 2. VÉ ĐÃ BÁN HÔM NAY =====
    const totalTickets = await BookingSeat.count({
      include: [
        {
          model: Booking,
          where: {
            status: "CONFIRMED",
            createdAt: {
              [Op.between]: [start, end],
            },
          },
          attributes: [],
        },
      ],
    });

    // ===== 3. DOANH THU HÔM NAY =====
    const totalRevenue =
      (await Booking.sum("totalPrice", {
        where: {
          status: "CONFIRMED",
          createdAt: {
            [Op.between]: [start, end],
          },
        },
      })) || 0;

    res.status(200).json({
      totalShowtimes,
      totalTickets,
      totalRevenue,
    });
  } catch (error) {
    console.error("dashboard today stats error:", error);
    res.status(500).json({ message: "Dashboard today stats error" });
  }
};
