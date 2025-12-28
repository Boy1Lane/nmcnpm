import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './TicketSuccess.css';

const TicketSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy dữ liệu vé từ trang Thanh Toán gửi sang
  const { orderId, selectedSeats, finalPrice } = location.state || {};

  // Nếu người dùng cố tình truy cập link này mà không có dữ liệu -> Đẩy về trang chủ
  if (!orderId) {
    return (
      <div style={{color:'white', padding:'50px', textAlign:'center'}}>
        <h1>🚫 Không tìm thấy vé!</h1>
        <p>Vui lòng đặt vé từ trang chủ.</p>
        <button 
            onClick={()=>navigate('/')}
            style={{padding:'10px 20px', marginTop:'20px', cursor:'pointer'}}
        >
            Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="success-container">
      <div className="ticket-card">
        {/* Phần đầu vé */}
        <div className="ticket-header">
          <h2>ĐẶT VÉ THÀNH CÔNG!</h2>
          <span>Cảm ơn bạn đã sử dụng dịch vụ</span>
        </div>
        
        {/* Phần thân vé */}
        <div className="ticket-body">
          <div className="info-group">
            <span className="label">PHIM</span>
            <span className="value">Avatar: The Way of Water</span>
          </div>
          
          <div className="info-group">
            <span className="label">THỜI GIAN</span>
            <span className="value">09:30 - Hôm nay</span>
          </div>
          
          <div className="info-group">
            <span className="label">VỊ TRÍ</span>
            <span className="value">Rạp 1 - Ghế: {selectedSeats?.join(', ')}</span>
          </div>

          <div className="info-group">
            <span className="label">TỔNG THANH TOÁN</span>
            <span className="value" style={{color:'#e50914'}}>{finalPrice?.toLocaleString()} đ</span>
          </div>

          <div className="info-group">
            <span className="label">MÃ ĐẶT CHỖ</span>
            <span className="value" style={{fontSize:'20px', letterSpacing:'2px'}}>{orderId}</span>
          </div>
          
          <div className="qr-code">
            {/* Tạo mã QR Code tự động từ Google API */}
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${orderId}`} 
              alt="QR Code" 
            />
            <p style={{fontSize:'12px', marginTop:'10px', color:'#888'}}>
              Đưa mã này cho nhân viên soát vé
            </p>
          </div>
        </div>

        {/* Nút quay về */}
        <button className="btn-home" onClick={() => navigate('/')}>
          QUAY VỀ TRANG CHỦ
        </button>
      </div>
    </div>
  );
};

export default TicketSuccess;