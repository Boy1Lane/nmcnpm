import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookingService from '../../services/Client/bookingService';
import './BookingPage.css';

const BookingPage = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const [showtimeSeats, setShowtimeSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    bookingService.getSeatsByShowtime(scheduleId).then(setShowtimeSeats).catch(console.error);
  }, [scheduleId]);

  const handleSeatClick = (sts) => {
    if (sts.status !== 'AVAILABLE') return;
    setSelectedSeats(prev =>
      prev.find(s => s.id === sts.id) ? prev.filter(s => s.id !== sts.id) : [...prev, sts]
    );
  };

  const calculateTotal = () => selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const handleNext = () => {
    // Chuyển sang trang chọn bắp nước, gửi kèm danh sách ghế đã chọn
    const seatIds = selectedSeats.map(s => s.seatId);
    navigate(`/concessions/${scheduleId}`, {
      state: {
        selectedSeatIds: seatIds,
        reservedSeats: selectedSeats, // Gửi cả object ghế để hiển thị tên ghế
        seatsPrice: calculateTotal()
      }
    });
  };

  return (
    <div className="booking-page" style={{ background: '#0a0a0a', color: 'white', padding: '40px 5%', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', color: '#e50914' }}>CHỌN GHẾ</h2>
      <div className="screen" style={{ width: '80%', height: '4px', background: '#e50914', margin: '30px auto', boxShadow: '0 0 15px #e50914' }}></div>
      <p style={{ textAlign: 'center', marginBottom: '40px', fontSize: '12px', color: '#888' }}>MÀN HÌNH</p>

      <div className="seats-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '10px', maxWidth: '800px', margin: '0 auto' }}>
        {showtimeSeats.map(sts => (
          <div
            key={sts.id}
            onClick={() => handleSeatClick(sts)}
            className={`seat ${sts.status.toLowerCase()}`}
            style={{
              padding: '10px', textAlign: 'center', borderRadius: '4px', fontSize: '12px', cursor: sts.status === 'AVAILABLE' ? 'pointer' : 'not-allowed',
              background: sts.status === 'SOLD' ? '#333' : sts.status === 'LOCKED' ? '#555' : selectedSeats.find(s => s.id === sts.id) ? '#e50914' : '#888',
              color: 'white'
            }}
          >
            {sts.Seat.row}{sts.Seat.number}
          </div>
        ))}
      </div>

      <div className="booking-footer" style={{ marginTop: '50px', textAlign: 'center', borderTop: '1px solid #333', paddingTop: '20px' }}>
        <p>Số ghế chọn: {selectedSeats.length}</p>
        <h3 style={{ margin: '15px 0' }}>Tổng tiền: {calculateTotal().toLocaleString()} đ</h3>
        <button
          onClick={handleNext}
          disabled={selectedSeats.length === 0}
          style={{ padding: '15px 50px', background: '#e50914', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
        >GIỮ GHẾ & TIẾP TỤC</button>
      </div>
    </div>
  );
};
export default BookingPage;