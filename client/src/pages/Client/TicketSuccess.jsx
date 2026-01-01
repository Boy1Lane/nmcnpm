import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './TicketSuccess.css'; // Đảm bảo file này nằm cùng thư mục với JSX

const TicketSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = location.state || {};

  if (!bookingId) {
    return (
      <div className="error-access" style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>
        <h1>🚫 Không tìm thấy thông tin vé!</h1>
        <p>Vui lòng thực hiện đặt vé từ trang chủ.</p>
        <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '10px 20px', background: '#e50914', color: 'white', border: 'none', cursor: 'pointer' }}>
            Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="success-container">
      <div className="ticket-card">
        <div className="ticket-header">
          <div className="success-icon">✔</div>
          <h2>ĐẶT VÉ THÀNH CÔNG!</h2>
          <p>Cảm ơn bạn đã lựa chọn CinemaVerse</p>
        </div>
        <div className="ticket-body">
          <div className="booking-id-section">
            <span className="label">MÃ ĐẶT VÉ CỦA BẠN</span>
            <h3 className="value-id">{bookingId}</h3>
          </div>
          <div className="qr-code-section">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${bookingId}`} 
              alt="Booking QR Code" 
            />
            <p className="qr-note">Đưa mã này cho nhân viên để nhận vé tại rạp</p>
          </div>
        </div>
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