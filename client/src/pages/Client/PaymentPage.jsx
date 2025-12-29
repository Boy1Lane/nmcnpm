import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookingService from '../../services/Client/bookingService';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      // Gọi API confirm trên Server
      await bookingService.confirmBooking(bookingId);
      
      // Truyền bookingId qua state để trang TicketSuccess nhận được
      navigate('/ticket-success', { state: { bookingId } });
    } catch (err) {
      alert("Thanh toán thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#0a0a0a', color: 'white', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#1a1a1a', padding: '40px', borderRadius: '10px', textAlign: 'center' }}>
        <h2>XÁC NHẬN THANH TOÁN</h2>
        <p style={{ margin: '20px 0', color: '#888' }}>Mã đơn hàng: #{bookingId}</p>
        <button 
          onClick={handlePayment} 
          disabled={loading}
          style={{ padding: '15px 40px', background: '#e50914', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {loading ? 'ĐANG XỬ LÝ...' : 'THANH TOÁN NGAY'}
        </button>
      </div>
    </div>
  );
};
export default PaymentPage;