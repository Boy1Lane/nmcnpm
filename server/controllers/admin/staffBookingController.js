/**
 * STAFF BOOKING CONTROLLER
 * ========================
 * - Dành cho staff bán vé tại quầy
 * - Khách vãng lai (userId = null)
 * - Route: /admin
 * - Flow:
 *   1. Giữ ghế (PENDING)
 *   2. Thêm bắp nước
 *   3. Áp khuyến mãi
 *   4. Xác nhận thanh toán (CASH / QR)
 *   5. Hủy booking (trả ghế)
 *
 * ❗ LƯU Ý:
 * - Không share code với user
 * - Không thay đổi DB / field
 * - Logic giữ nguyên theo code gốc
 */

const {
  Booking,
  BookingSeat,
  BookingFood,
  Showtime,
  ShowtimeSeat
} = require('../../models');

const Promotion = require('../../models/Promotion');
const { Op } = require('sequelize');
const sequelize = require('../../config/db');

/**
 * POST /admin/bookings
 * Staff giữ ghế cho khách vãng lai
 */
exports.createBooking = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { showtimeId, seatIds, paymentMethod } = req.body;

    // 1. Validate input
    if (!showtimeId || !Array.isArray(seatIds) || seatIds.length === 0 || !paymentMethod) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // 2. Kiểm tra showtime tồn tại
    const showtime = await Showtime.findByPk(showtimeId, { transaction });
    if (!showtime) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Showtime not found' });
    }

    // 3. Lấy danh sách ghế và lock để tránh race condition
    const showtimeSeats = await ShowtimeSeat.findAll({
      where: { showtimeId, seatId: seatIds },
      lock: transaction.LOCK.UPDATE,
      transaction
    });

    // 4. Validate seatIds
    if (showtimeSeats.length !== seatIds.length) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Invalid seat IDs for this showtime' });
    }

    // 5. Kiểm tra ghế phải AVAILABLE
    const unavailable = showtimeSeats.some(seat => seat.status !== 'AVAILABLE');
    if (unavailable) {
      await transaction.rollback();
      return res.status(409).json({ message: 'One or more seats are not available' });
    }

    // 6. Tính tổng tiền ghế
    const totalPrice = showtimeSeats.reduce((sum, seat) => sum + seat.price, 0);

    // 7. Tạo booking (khách vãng lai => userId = null)
    const booking = await Booking.create({
      userId: null,
      showtimeId,
      totalPrice,
      paymentMethod,
      status: 'PENDING',
      bookingDate: new Date()
    }, { transaction });

    // 8. Update ghế sang LOCKED
    await ShowtimeSeat.update({
      status: 'LOCKED',
      lockedAt: new Date()
    }, {
      where: { id: showtimeSeats.map(s => s.id) },
      transaction
    });

    // 9. Tạo BookingSeat
    await BookingSeat.bulkCreate(
      showtimeSeats.map(seat => ({
        bookingId: booking.id,
        showtimeSeatId: seat.id,
        price: seat.price
      })),
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      message: 'Seats held successfully',
      booking
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Staff createBooking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * POST /admin/bookings/:id/foods
 * Thêm combo bắp nước vào booking
 */
exports.addFoodsToBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { foodComboIds } = req.body;

    // 1. Validate input
    if (!Array.isArray(foodComboIds) || foodComboIds.length === 0) {
      return res.status(400).json({ message: 'foodComboIds must be a non-empty array' });
    }

    // 2. Check booking tồn tại
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // 3. Thêm từng combo, tránh trùng
    const created = [];
    for (const foodComboId of foodComboIds) {
      const exists = await BookingFood.findOne({
        where: { bookingId: id, foodComboId }
      });
      if (exists) continue;

      const bf = await BookingFood.create({ bookingId: id, foodComboId });
      created.push(bf);
    }

    res.status(201).json({
      message: 'Food combos added successfully',
      added: created.length
    });

  } catch (error) {
    console.error('addFoodsToBooking error:', error);
    res.status(500).json({ message: 'addFoodsToBooking error' });
  }
};

/**
 * POST /admin/bookings/:id/apply-promotion
 * Staff áp mã khuyến mãi cho booking
 */
exports.applyPromotion = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { code } = req.body;

    // 1. Validate input
    if (!code) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Promotion code is required' });
    }

    // 2. Check booking (chỉ cho PENDING)
    const booking = await Booking.findOne({
      where: { id, status: 'PENDING' },
      lock: transaction.LOCK.UPDATE,
      transaction
    });

    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Booking not found or already processed' });
    }

    // 3. Tìm promotion hợp lệ
    const promotion = await Promotion.findOne({
      where: {
        code,
        validFrom: { [Op.lte]: new Date() },
        validTo: { [Op.gte]: new Date() },
        usageLimit: { [Op.gt]: 0 }
      },
      transaction
    });

    if (!promotion) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Invalid or expired promotion code' });
    }

    // 4. Tính tiền giảm
    const discountAmount =
      (booking.totalPrice * promotion.discountPercentage) / 100;

    const finalPrice = booking.totalPrice - discountAmount;

    // 5. Update booking
    booking.totalPrice = finalPrice;
    await booking.save({ transaction });

    // 6. Giảm usageLimit
    promotion.usageLimit -= 1;
    await promotion.save({ transaction });

    await transaction.commit();

    res.json({
      message: 'Promotion applied successfully',
      discountAmount,
      finalPrice
    });

  } catch (error) {
    await transaction.rollback();
    console.error('applyPromotion error:', error);
    res.status(500).json({ message: 'applyPromotion error' });
  }
};

/**
 * POST /admin/bookings/confirm
 * Staff xác nhận thanh toán
 */
exports.confirmBooking = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { bookingId } = req.body;

    // 1. Check booking
    const booking = await Booking.findOne({
      where: { id: bookingId, status: 'PENDING' },
      lock: transaction.LOCK.UPDATE,
      transaction
    });

    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Booking not found or already processed' });
    }

    // 2. Update booking
    booking.status = 'CONFIRMED';
    await booking.save({ transaction });

    // 3. Update ghế sang SOLD
    const bookingSeats = await BookingSeat.findAll({
      where: { bookingId },
      transaction
    });

    await ShowtimeSeat.update({
      status: 'SOLD',
      lockedAt: null
    }, {
      where: { id: bookingSeats.map(bs => bs.showtimeSeatId) },
      transaction
    });

    await transaction.commit();
    res.json({ message: 'Booking confirmed by staff' });

  } catch (error) {
    await transaction.rollback();
    console.error('confirmBooking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * DELETE /admin/bookings/:id
 * Staff hủy booking (trả ghế)
 */
exports.cancelBooking = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    // 1. Check booking
    const booking = await Booking.findOne({
      where: { id, status: 'PENDING' },
      lock: transaction.LOCK.UPDATE,
      transaction
    });

    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Booking not found' });
    }

    // 2. Update booking
    booking.status = 'CANCELLED';
    await booking.save({ transaction });

    // 3. Trả ghế về AVAILABLE
    const bookingSeats = await BookingSeat.findAll({
      where: { bookingId: id },
      transaction
    });

    await ShowtimeSeat.update({
      status: 'AVAILABLE',
      lockedAt: null
    }, {
      where: { id: bookingSeats.map(bs => bs.showtimeSeatId) },
      transaction
    });

    await transaction.commit();
    res.json({ message: 'Booking cancelled successfully' });

  } catch (error) {
    await transaction.rollback();
    console.error('cancelBooking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

