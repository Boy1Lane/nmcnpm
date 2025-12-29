import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Điều chỉnh đường dẫn đến service để lấy dữ liệu từ server
import bookingService from '../../services/Client/bookingService'; 
// Điều chỉnh đường dẫn đến CSS trong folder styles/Client
import './BookingPage.css'; 

const BookingPage = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 1. Tải ghế từ Database ---
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setLoading(true);
        // Gọi API lấy sơ đồ ghế dựa trên ID lịch chiếu
        const data = await bookingService.getSeatsByShowtime(scheduleId);
        setSeats(data);
      } catch (err) {
        console.error("Lỗi tải ghế:", err);
        setError("Không thể tải sơ đồ ghế. Vui lòng kiểm tra lại dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
    if (scheduleId) fetchSeats();
  }, [scheduleId]);

  // --- 2. Xử lý chọn/bỏ chọn ghế ---
  const handleSeatClick = (seat) => {
    // Chỉ cho phép chọn nếu ghế ở trạng thái AVAILABLE (Trống)
    if (seat.status !== 'AVAILABLE') return;

    const isSelected = selectedSeats.includes(seat.id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(id => id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  };

  // --- 3. Tính tổng tiền dựa trên giá của từng loại ghế ---
  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = seats.find(s => s.id === seatId);
      return total + (seat ? seat.price : 0);
    }, 0);
  };

  // --- 4. Chuyển sang trang bắp nước ---
  const handleNext = () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất 1 ghế!");
      return;
    }
    // Chuyển sang trang concessions nằm trong folder Client
    navigate(`/booking/${scheduleId}/concessions`, {
      state: {
        selectedSeatIds: selectedSeats,
        seatsPrice: calculateTotalPrice()
      }
    });
  };

  if (loading) return <div className="loading-state">Đang tải sơ đồ ghế...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="booking-container">
      <h2 className="page-title">Chọn ghế ngồi</h2>
      
      {/* Khu vực màn hình chiếu */}
      <div className="screen-container">
        <div className="screen">MÀN HÌNH</div>
      </div>

      {/* Sơ đồ hiển thị ghế ngồi */}
      <div className="seat-map">
        {seats.map((seat) => {
          const isSelected = selectedSeats.includes(seat.id);
          const isSold = seat.status === 'SOLD';
          
          // Class CSS động dựa trên loại ghế và trạng thái
          let seatClass = `seat ${seat.Seat?.type?.toLowerCase() || 'normal'}`;
          if (isSold) seatClass += ' sold';
          else if (isSelected) seatClass += ' selected';

          return (
            <button
              key={seat.id}
              className={seatClass}
              onClick={() => handleSeatClick(seat)}
              disabled={isSold}
              title={`${seat.Seat?.row}${seat.Seat?.number} - ${seat.price.toLocaleString()}đ`}
            >
              {seat.Seat ? `${seat.Seat.row}${seat.Seat.number}` : '??'}
            </button>
          );
        })}
      </div>

      {/* Chú thích màu sắc ghế */}
      <div className="legend">
        <div className="legend-item"><span className="box red"></span> Đã bán</div>
        <div className="legend-item"><span className="box yellow"></span> Đang chọn</div>
        <div className="legend-item"><span className="box gray"></span> Thường</div>
        <div className="legend-item"><span className="box purple"></span> VIP</div>
      </div>

      {/* Thanh thông tin tổng quát phía dưới cùng */}
      <div className="booking-summary">
        <div className="total-info">
          <p>Ghế đã chọn: <strong>{selectedSeats.length}</strong></p>
          <h3 className="total-price">Tổng: {calculateTotalPrice().toLocaleString()} đ</h3>
        </div>
        <button onClick={handleNext} className="btn-next" disabled={selectedSeats.length === 0}>
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default BookingPage;