const { sequelize, Booking, BookingSeat, BookingFood, ShowtimeSeat, Seat, FoodCombo } = require('../../models');

const bookingController = {
    
    // 1. API lấy danh sách ghế của suất chiếu (để vẽ sơ đồ ghế)
    getSeatsByShowtime: async (req, res) => {
        try {
            const { showtimeId } = req.params;
            
            // Lấy dữ liệu từ bảng ShowtimeSeat (bảng trung gian)
            // Kèm theo thông tin ghế vật lý (Hàng A, Số 1, Loại VIP...)
            const seats = await ShowtimeSeat.findAll({
                where: { showtimeId },
                include: [{
                    model: Seat,
                    attributes: ['row', 'number', 'type'] // Chỉ lấy row, number, type
                }],
                order: [
                    [Seat, 'row', 'ASC'], 
                    [Seat, 'number', 'ASC']
                ]
            });

            if (!seats || seats.length === 0) {
                return res.status(404).json({ message: 'Chưa có dữ liệu ghế cho suất chiếu này (Cần chạy script tạo dữ liệu mẫu)' });
            }

            res.status(200).json(seats);
        } catch (error) {
            console.error("Lỗi lấy ghế:", error);
            res.status(500).json({ message: 'Lỗi server khi tải ghế' });
        }
    },

    // 2. API Đặt vé (Transaction quan trọng)
    createBooking: async (req, res) => {
        const t = await sequelize.transaction(); // Bắt đầu giao dịch an toàn
        try {
            const userId = req.user.id; // Lấy ID user từ token đăng nhập
            const { showtimeId, seats, foods, paymentMethod } = req.body;
            // seats: Mảng các ID của ShowtimeSeat (VD: [1, 2])
            // foods: Mảng món ăn (VD: [{ foodComboId: 1, quantity: 2 }])

            // --- BƯỚC A: KIỂM TRA VÀ KHÓA GHẾ ---
            // Tìm các ghế user chọn trong DB
            const selectedSeats = await ShowtimeSeat.findAll({
                where: { 
                    id: seats, 
                    showtimeId: showtimeId,
                    status: 'AVAILABLE' // Chỉ lấy ghế còn trống
                },
                transaction: t,
                lock: true // KHÓA DÒNG (Người khác không thể chọn cùng lúc)
            });

            // Nếu số ghế tìm được < số ghế user gửi lên => Có ghế đã bị người khác mua
            if (selectedSeats.length !== seats.length) {
                await t.rollback();
                return res.status(400).json({ message: 'Một trong số các ghế bạn chọn vừa được người khác đặt. Vui lòng chọn lại!' });
            }

            // Tính tổng tiền ghế & Cập nhật trạng thái thành SOLD
            let totalTicketPrice = 0;
            for (const seat of selectedSeats) {
                totalTicketPrice += seat.price;
            }

            // Cập nhật trạng thái ghế sang ĐÃ BÁN
            await ShowtimeSeat.update(
                { status: 'SOLD' },
                { where: { id: seats }, transaction: t }
            );

            // --- BƯỚC B: TÍNH TIỀN ĐỒ ĂN (Nếu có) ---
            let totalFoodPrice = 0;
            let bookingFoodData = [];

            if (foods && foods.length > 0) {
                for (const item of foods) {
                    const combo = await FoodCombo.findByPk(item.foodComboId);
                    if (combo) {
                        totalFoodPrice += combo.price * item.quantity;
                        bookingFoodData.push({
                            foodComboId: item.foodComboId,
                            quantity: item.quantity,
                            // bookingId sẽ gán sau khi tạo booking
                        });
                    }
                }
            }

            // --- BƯỚC C: TẠO ĐƠN HÀNG (BOOKING) ---
            const newBooking = await Booking.create({
                userId: userId,
                showtimeId: showtimeId,
                totalPrice: totalTicketPrice + totalFoodPrice,
                status: 'CONFIRMED',
                paymentMethod: paymentMethod || 'CASH'
            }, { transaction: t });

            // --- BƯỚC D: LƯU CHI TIẾT GHẾ & ĐỒ ĂN ---
            // Lưu vào bảng BookingSeat
            const bookingSeatData = seats.map(seatId => ({
                bookingId: newBooking.id,
                showtimeSeatId: seatId
            }));
            await BookingSeat.bulkCreate(bookingSeatData, { transaction: t });

            // Lưu vào bảng BookingFood (nếu có)
            if (bookingFoodData.length > 0) {
                const finalFoodData = bookingFoodData.map(f => ({ ...f, bookingId: newBooking.id }));
                await BookingFood.bulkCreate(finalFoodData, { transaction: t });
            }

            // --- HOÀN TẤT ---
            await t.commit(); // Lưu tất cả vào DB
            res.status(200).json({ message: 'Đặt vé thành công!', bookingId: newBooking.id });

        } catch (error) {
            await t.rollback(); // Nếu lỗi thì hoàn tác tất cả
            console.error("Lỗi đặt vé:", error);
            res.status(500).json({ message: 'Đặt vé thất bại', error: error.message });
        }
    }
};

module.exports = bookingController;