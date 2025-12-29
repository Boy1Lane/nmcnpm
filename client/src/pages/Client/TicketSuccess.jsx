import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Cập nhật đường dẫn CSS vào folder styles/Client
import './TicketSuccess.css';

const TicketSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Nhận bookingId được truyền từ trang PaymentPage sau khi API trả về thành công
  const { bookingId } = location.state || {};

  // Nếu không có dữ liệu đặt vé (truy cập lậu), đẩy về trang chủ
  if (!bookingId) {
    return (
      <div className="error-access">
        <h1>🚫 Không tìm thấy thông tin vé!</h1>
        <p>Vui lòng thực hiện đặt vé từ trang chủ.</p>
        <button className="btn-return" onClick={() => navigate('/')}>
            Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="success-container">
      <div className="ticket-card">
        {/* Phần đầu vé: Thông báo trạng thái */}
        <div className="ticket-header">
          <div className="success-icon">✔</div>
          <h2>ĐẶT VÉ THÀNH CÔNG!</h2>
          <p>Cảm ơn bạn đã lựa chọn CinemaVerse</p>
        </div>
        
        {/* Phần thân vé: Hiển thị mã đặt chỗ và QR */}
        <div className="ticket-body">
          <div className="booking-id-section">
            <span className="label">MÃ ĐẶT VÉ CỦA BẠN</span>
            <h3 className="value-id">{bookingId}</h3>
          </div>
          
          <div className="qr-code-section">
            {/* Sử dụng API để tạo mã QR tự động từ mã bookingId */}
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${bookingId}`} 
              alt="Booking QR Code" 
            />
            <p className="qr-note">Đưa mã này cho nhân viên để nhận vé tại rạp</p>
          </div>

          <div className="ticket-instruction">
            <p>ℹ Thông tin chi tiết vé đã được lưu vào lịch sử giao dịch của bạn.</p>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="ticket-footer">
          <button className="btn-home-success" onClick={() => navigate('/')}>
            QUAY VỀ TRANG CHỦ
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketSuccess;