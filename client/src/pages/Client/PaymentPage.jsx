import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// Cập nhật đường dẫn đến service của Client
import bookingService from '../../services/Client/bookingService';
// Cập nhật đường dẫn đến CSS trong styles/Client
import './PaymentPage.css';

const PaymentPage = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Nhận dữ liệu từ các bước trước (Ghế và Bắp nước) thông qua state
  const { selectedSeatIds, seatsPrice, selectedFoods = [] } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [isProcessing, setIsProcessing] = useState(false);

  // Tính toán tổng số tiền cuối cùng
  const foodsPrice = selectedFoods.reduce((total, item) => total + (item.price * item.quantity), 0);
  const finalTotal = (seatsPrice || 0) + foodsPrice;

  // --- XỬ LÝ GỬI DỮ LIỆU ĐẶT VÉ LÊN SERVER ---
  const handlePayment = async () => {
    if (!selectedSeatIds || selectedSeatIds.length === 0) {
      alert("Dữ liệu đặt vé không hợp lệ!");
      return;
    }

    try {
      setIsProcessing(true);

      // Chuẩn bị object dữ liệu theo đúng định dạng Backend yêu cầu
      const bookingData = {
        showtimeId: scheduleId,
        seats: selectedSeatIds, // Mảng ID của các ShowtimeSeat
        foods: selectedFoods.map(f => ({ foodComboId: f.id, quantity: f.quantity })),
        paymentMethod: paymentMethod
      };

      // Gọi API createBooking để lưu vào cơ sở dữ liệu
      const result = await bookingService.createBooking(bookingData);

      // Nếu thành công, chuyển đến trang thông báo thành công
      alert("Đặt vé thành công!");
      navigate('/ticket-success', { state: { bookingId: result.bookingId } });

    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      // Hiển thị thông báo lỗi cụ thể từ Server (ví dụ: Ghế đã có người khác chọn)
      alert(error.response?.data?.message || "Đặt vé thất bại, vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Kiểm tra nếu không có dữ liệu truyền vào (truy cập trái phép)
  if (!location.state) {
    return (
      <div className="p-10 text-center">
        <h3>Không tìm thấy thông tin đặt vé.</h3>
        <button onClick={() => navigate('/')} className="btn-home">Về trang chủ</button>
      </div>
    );
  }

  return (
    <div className="payment-page-container">
      <h2 className="section-title">Thanh Toán</h2>
      
      <div className="payment-content">
        {/* Lựa chọn phương thức thanh toán */}
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

        {/* Tóm tắt thông tin đơn hàng */}
        <div className="order-summary-card">
          <h3>Chi tiết đơn hàng</h3>
          <div className="summary-row">
            <span>Tiền vé ghế:</span>
            <span>{seatsPrice?.toLocaleString()} đ</span>
          </div>
          <div className="summary-row">
            <span>Tiền bắp nước:</span>
            <span>{foodsPrice.toLocaleString()} đ</span>
          </div>
          <hr className="divider" />
          <div className="summary-row total-row">
            <span>Tổng số tiền:</span>
            <span className="final-amount">{finalTotal.toLocaleString()} đ</span>
          </div>

          <button 
            className="btn-confirm-payment" 
            onClick={handlePayment} 
            disabled={isProcessing}
          >
            {isProcessing ? 'Đang xác nhận...' : 'XÁC NHẬN THANH TOÁN'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;