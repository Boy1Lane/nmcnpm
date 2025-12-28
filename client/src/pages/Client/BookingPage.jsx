import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BookingPage.css';

const BookingPage = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();

  // Giá vé cơ bản
  const TICKET_PRICE = 85000;

  // Giả lập danh sách ghế (10 hàng, mỗi hàng 8 ghế)
  // Trong thực tế, dữ liệu này sẽ lấy từ API (để biết ghế nào đã bán)
  const ROWS = 8;
  const COLS = 10;
  
  // Giả lập một số ghế ĐÃ BÁN (Sold) - ID ghế dạng "A1", "B5"...
  const soldSeats = ['A3', 'A4', 'C5', 'C6', 'E8'];

  // State lưu các ghế đang chọn
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Hàm tạo mã ghế (Ví dụ: Hàng 0, Cột 0 -> A1)
  const getSeatLabel = (row, col) => {
    const rowLabel = String.fromCharCode(65 + row); // 65 là mã ASCII của 'A'
    return `${rowLabel}${col + 1}`;
  };

  const handleSeatClick = (seatLabel) => {
    if (soldSeats.includes(seatLabel)) return; // Ghế đỏ không bấm được

    if (selectedSeats.includes(seatLabel)) {
      // Nếu đã chọn -> Bỏ chọn (Xóa khỏi mảng)
      setSelectedSeats(selectedSeats.filter(s => s !== seatLabel));
    } else {
      // Nếu chưa chọn -> Thêm vào mảng
      setSelectedSeats([...selectedSeats, seatLabel]);
    }
  };

  // Tính tổng tiền
  const totalPrice = selectedSeats.length * TICKET_PRICE;

  const handleNextStep = () => {
    // Chuyển sang trang Bắp nước (sẽ làm ở bước sau)
    // Truyền state ghế và tổng tiền sang trang sau
    navigate('/booking/concessions', { state: { selectedSeats, totalPrice, scheduleId } });
  };

  return (
    <div className="booking-container">
      <h2>Màn hình chiếu</h2>
      <div className="screen"></div>

      {/* Sơ đồ ghế */}
      <div className="seat-map">
        {Array.from({ length: ROWS }).map((_, rowIndex) => (
          <div key={rowIndex} className="seat-row">
            {Array.from({ length: COLS }).map((_, colIndex) => {
              const seatLabel = getSeatLabel(rowIndex, colIndex);
              const isSold = soldSeats.includes(seatLabel);
              const isSelected = selectedSeats.includes(seatLabel);
              
              let seatClass = "seat available"; // Mặc định: Xanh/Trống
              if (isSold) seatClass = "seat sold"; // Đỏ
              if (isSelected) seatClass = "seat selected"; // Vàng

              return (
                <div 
                  key={seatLabel} 
                  className={seatClass}
                  onClick={() => handleSeatClick(seatLabel)}
                >
                  {seatLabel}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Chú thích màu */}
      <div className="legend">
        <div className="legend-item"><div className="box green"></div> Ghế trống</div>
        <div className="legend-item"><div className="box yellow"></div> Đang chọn</div>
        <div className="legend-item"><div className="box red"></div> Đã bán</div>
      </div>

      {/* Thanh thanh toán dưới cùng */}
      <div className="booking-summary">
        <div className="info">
          <p>Ghế đã chọn: <strong>{selectedSeats.join(', ') || 'Chưa chọn'}</strong></p>
          <p>Tạm tính: <strong style={{color: '#f1c40f', fontSize: '20px'}}>
            {totalPrice.toLocaleString('vi-VN')} đ
          </strong></p>
        </div>
        <button 
          className="btn-next" 
          disabled={selectedSeats.length === 0}
          onClick={handleNextStep}
        >
          TIẾP TỤC &gt;
        </button>
      </div>
    </div>
  );
};

export default BookingPage;