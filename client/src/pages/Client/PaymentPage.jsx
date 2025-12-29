import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import './PaymentPage.css';

const PaymentPage = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy dữ liệu được truyền từ các trang trước
  const { selectedSeatIds, seatsPrice, selectedFoods = [] } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [isProcessing, setIsProcessing] = useState(false);

  // Tính tổng tiền cuối cùng
  const foodsPrice = selectedFoods.reduce((total, item) => total + (item.price * item.quantity), 0);
  const finalTotal = (seatsPrice || 0) + foodsPrice;

  // --- XỬ LÝ THANH TOÁN ---
  const handlePayment = async () => {
    if (!selectedSeatIds || selectedSeatIds.length === 0) {
      alert("Dữ liệu đặt vé không hợp lệ!");
      return;
    }

    try {
      setIsProcessing(true);

      // Chuẩn bị dữ liệu gửi lên Server
      const bookingData = {
        showtimeId: scheduleId,
        seats: selectedSeatIds, // Mảng ID của ShowtimeSeat
        foods: selectedFoods.map(f => ({ foodComboId: f.id, quantity: f.quantity })),
        paymentMethod: paymentMethod
      };

      console.log("Sending booking data:", bookingData);

      // Gọi API
      const result = await bookingService.createBooking(bookingData);

      // Thành công -> Chuyển sang trang vé
      alert("Đặt vé thành công!");
      navigate('/ticket-success', { state: { bookingId: result.bookingId } });

    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      // Hiển thị thông báo lỗi từ Server trả về (ví dụ: Ghế vừa bị người khác mua)
      alert(error.response?.data?.message || "Đặt vé thất bại, vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!location.state) {
    return <div className="p-10 text-center">Không tìm thấy thông tin đặt vé. <a href="/">Về trang chủ</a></div>;
  }

  return (
    <div className="payment-page-container">
      <h2>Thanh Toán</h2>
      
      <div className="payment-content">
        {/* Cột trái: Phương thức thanh toán */}
        <div className="payment-methods">
          <h3>Chọn phương thức</h3>
          <div className={`method-item ${paymentMethod === 'CASH' ? 'active' : ''}`}
               onClick={() => setPaymentMethod('CASH')}>
            <span>💵 Tiền mặt (Thanh toán tại quầy)</span>
          </div>
          <div className={`method-item ${paymentMethod === 'CREDIT_CARD' ? 'active' : ''}`}
               onClick={() => setPaymentMethod('CREDIT_CARD')}>
            <span>💳 Thẻ tín dụng / Visa</span>
          </div>
          <div className={`method-item ${paymentMethod === 'MOMO' ? 'active' : ''}`}
               onClick={() => setPaymentMethod('MOMO')}>
            <span>📱 Ví MoMo</span>
          </div>
        </div>

        {/* Cột phải: Thông tin đơn hàng */}
        <div className="order-summary">
          <h3>Thông tin vé</h3>
          <div className="summary-row">
            <span>Tiền ghế:</span>
            <span>{seatsPrice?.toLocaleString()} đ</span>
          </div>
          <div className="summary-row">
            <span>Tiền bắp nước:</span>
            <span>{foodsPrice.toLocaleString()} đ</span>
          </div>
          <hr />
          <div className="summary-row total">
            <span>Tổng cộng:</span>
            <span>{finalTotal.toLocaleString()} đ</span>
          </div>

          <button 
            className="btn-pay" 
            onClick={handlePayment} 
            disabled={isProcessing}
          >
            {isProcessing ? 'Đang xử lý...' : 'XÁC NHẬN THANH TOÁN'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;