import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentPage.css';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {}; // Lấy dữ liệu từ trang Bắp nước

  // Dữ liệu an toàn (tránh lỗi nếu user vào thẳng link mà không qua các bước trước)
  const { 
    selectedSeats = [], 
    selectedCombos = [], 
    totalTickets = 0, 
    totalCombos = 0, 
    discount = 0, 
    finalPrice = 0,
    scheduleId 
  } = state;

  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    // Giả lập gọi API thanh toán mất 2 giây
    setTimeout(() => {
      setIsProcessing(false);
      // Thanh toán xong -> Chuyển sang trang Vé Thành Công
      // Tạo mã đơn hàng ngẫu nhiên
      const fakeOrderId = 'ORD-' + Math.floor(Math.random() * 1000000);
      
      navigate('/ticket-success', { 
        state: { 
          ...state, 
          paymentMethod, 
          orderId: fakeOrderId 
        } 
      });
    }, 2000);
  };

  return (
    <div className="payment-container">
      <div className="payment-content">
        {/* Cột Trái: Hóa đơn */}
        <div className="bill-section">
          <h2>📦 THÔNG TIN ĐẶT VÉ</h2>
          <div className="bill-row">
            <span>Phim</span>
            <strong>Avatar: The Way of Water</strong>
          </div>
          <div className="bill-row">
            <span>Suất chiếu</span>
            <span>09:30 - Rạp 1</span>
          </div>
          <div className="bill-row">
            <span>Ghế ({selectedSeats.length})</span>
            <strong>{selectedSeats.join(', ')}</strong>
          </div>
          <div className="bill-row">
            <span>Tiền vé</span>
            <span>{totalTickets.toLocaleString()} đ</span>
          </div>
          
          {selectedCombos.length > 0 && (
            <div className="bill-row">
              <span>Bắp nước</span>
              <span>
                {selectedCombos.map(c => `${c.quantity}x ${c.name}`).join(', ')}
                <br/>
                ({totalCombos.toLocaleString()} đ)
              </span>
            </div>
          )}

          {discount > 0 && (
            <div className="bill-row" style={{color: '#2ecc71'}}>
              <span>Voucher giảm giá</span>
              <span>- {discount.toLocaleString()} đ</span>
            </div>
          )}

          <div className="bill-row total">
            <span>TỔNG THANH TOÁN</span>
            <span>{finalPrice.toLocaleString()} đ</span>
          </div>
        </div>

        {/* Cột Phải: Phương thức thanh toán */}
        <div className="method-section">
          <h2 style={{color: 'white', textAlign: 'center', marginBottom: '20px'}}>💳 CHỌN CÁCH THANH TOÁN</h2>
          
          <div className={`method-item ${paymentMethod === 'momo' ? 'active' : ''}`} onClick={() => setPaymentMethod('momo')}>
            <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" className="method-icon" alt="Momo"/>
            <div>
              <strong>Ví MoMo</strong>
              <p style={{fontSize:'12px', color:'#aaa'}}>Quét mã QR để thanh toán</p>
            </div>
          </div>

          <div className={`method-item ${paymentMethod === 'zalo' ? 'active' : ''}`} onClick={() => setPaymentMethod('zalo')}>
            <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png" className="method-icon" alt="Zalo"/>
            <div>
              <strong>ZaloPay</strong>
              <p style={{fontSize:'12px', color:'#aaa'}}>Giảm 5% cho bạn mới</p>
            </div>
          </div>

          <div className={`method-item ${paymentMethod === 'card' ? 'active' : ''}`} onClick={() => setPaymentMethod('card')}>
            <img src="https://cdn-icons-png.flaticon.com/512/179/179457.png" className="method-icon" alt="Card"/>
            <div>
              <strong>Thẻ ATM / Visa / Master</strong>
              <p style={{fontSize:'12px', color:'#aaa'}}>Thanh toán qua cổng Napas</p>
            </div>
          </div>

          <button className="btn-pay" onClick={handlePay} disabled={isProcessing}>
            {isProcessing ? '⏳ ĐANG XỬ LÝ...' : `THANH TOÁN ${finalPrice.toLocaleString()} đ`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;