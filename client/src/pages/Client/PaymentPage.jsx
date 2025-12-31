import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import bookingService from '../../services/Client/bookingService';
import { message } from 'antd'; // Sử dụng antd message cho đẹp
import './PaymentPage.css'; // Sẽ tạo file css này hoặc dùng lại style cũ

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Lấy dữ liệu từ state
  const { selectedSeatIds, reservedSeats, seatsPrice, selectedFoods, scheduleId } = state || {};

  const [promotionCode, setPromotionCode] = useState('');
  const [loading, setLoading] = useState(false);

  if (!state) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>
        <h2>Không tìm thấy thông tin đặt vé</h2>
        <button onClick={() => navigate('/')}>Về trang chủ</button>
      </div>
    );
  }

  // Tính toán
  const foodTotal = selectedFoods ? selectedFoods.reduce((acc, item) => acc + (item.price * item.quantity), 0) : 0;
  const subTotal = (seatsPrice || 0) + foodTotal;
  // TODO: Nếu có API check promo trước thì gọi ở đây để lấy discountAmount realtime. 
  // Hiện tại logic server là tính lúc createBooking. 
  // Để đơn giản, ta sẽ chỉ input code, server sẽ tính và trả về giá cuối sau khi bấm Thanh Toán.

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Chuẩn bị dữ liệu đồ ăn
      const foodItemsPayload = selectedFoods ? selectedFoods.map(f => ({
        foodId: f.id,
        quantity: f.quantity
      })) : [];

      // 1. Gọi API tạo Booking (Lúc này mới giữ ghế và áp code)
      // scheduleId cần được truyền từ các trang trước. 
      // BookingPage -> ConcessionsPage -> PaymentPage
      // Cần đảm bảo ConcessionsPage nhận scheduleId và truyền tiếp.

      // Ở đây ta giả sử scheduleId có trong state (cần update BookingPage/ConcessionsPage để truyền nó)
      if (!selectedSeatIds || selectedSeatIds.length === 0) {
        message.error("Vui lòng chọn ghế!");
        return;
      }

      // Hack: Nếu state không có scheduleId (do luồng cũ), ta có thể lấy từ URL nếu PaymentPage có param. 
      // Nhưng ta dùng route /payment chung. Nên bắt buộc phải pass trong state.

      const createRes = await bookingService.createBooking(
        // scheduleId lấy từ state (cần verify flow)
        // Nếu ConcessionsPage dùng useParams để lấy scheduleId, nó phải pass vào state khi nav sang Payment
        state.scheduleId,
        selectedSeatIds,
        'CASH',
        foodItemsPayload,
        promotionCode
      );

      const bookingId = createRes.booking.id;
      message.success("Đã tạo đơn hàng thành công!");

      // 2. Xác nhận thanh toán ngay (Giả lập thanh toán thành công)
      await bookingService.confirmBooking(bookingId);

      message.success("Thanh toán thành công!");
      navigate('/ticket-success', { state: { bookingId } });

    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Thanh toán thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page-container" style={{ background: '#0a0a0a', color: 'white', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="payment-content" style={{ maxWidth: '800px', margin: '0 auto', background: '#1a1a1a', padding: '30px', borderRadius: '12px' }}>
        <h2 style={{ textAlign: 'center', color: '#e50914', marginBottom: '30px' }}>XÁC NHẬN & THANH TOÁN</h2>

        <div className="review-section">
          {/* 1. Thông tin Ghế */}
          <div className="review-block">
            <h3>Danh sách ghế</h3>
            <p>{reservedSeats && reservedSeats.map(s => `${s.Seat.row}${s.Seat.number}`).join(', ')}</p>
            <p>Giá vé: <strong>{seatsPrice?.toLocaleString()} đ</strong></p>
          </div>
          <hr style={{ borderColor: '#333' }} />

          {/* 2. Thông tin Bắp Nước */}
          {selectedFoods && selectedFoods.length > 0 && (
            <div className="review-block">
              <h3>Bắp & Nước</h3>
              {selectedFoods.map((f, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{f.name} (x{f.quantity})</span>
                  <span>{(f.price * f.quantity).toLocaleString()} đ</span>
                </div>
              ))}
              <p style={{ marginTop: '10px' }}>Tổng bắp nước: <strong>{foodTotal.toLocaleString()} đ</strong></p>
              <hr style={{ borderColor: '#333' }} />
            </div>
          )}

          {/* 3. Khuyến mãi */}
          <div className="promotion-block" style={{ margin: '20px 0' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Mã giảm giá (nếu có):</label>
            <input
              type="text"
              value={promotionCode}
              onChange={(e) => setPromotionCode(e.target.value)}
              placeholder="Nhập mã khuyến mãi..."
              style={{ padding: '10px', width: '100%', borderRadius: '4px', border: '1px solid #444', background: '#333', color: 'white' }}
            />
          </div>

          {/* 4. Tổng tiền tạm tính */}
          <div className="total-block" style={{ textAlign: 'right', fontSize: '1.2rem', marginTop: '20px' }}>
            <p>Tạm tính: {subTotal.toLocaleString()} đ</p>
            <p style={{ fontSize: '0.9rem', color: '#ccc' }}>(Tiền giảm giá sẽ được trừ sau khi bấm Thanh Toán)</p>
          </div>
        </div>

        <div className="action-footer" style={{ marginTop: '40px', textAlign: 'center' }}>
          <button
            onClick={handlePayment}
            disabled={loading}
            style={{
              padding: '15px 60px',
              background: loading ? '#666' : '#e50914',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '100%'
            }}
          >
            {loading ? 'ĐANG XỬ LÝ...' : `THANH TOÁN • ${subTotal.toLocaleString()} đ`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;