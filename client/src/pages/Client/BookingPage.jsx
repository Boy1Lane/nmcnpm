import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import bookingService from '../../services/Client/bookingService';
import { useAuth } from '../../context/AuthContext';
import { Layout, Steps, Button, Tooltip, Typography, message, Spin } from 'antd';
import { UserOutlined, ShoppingCartOutlined, CreditCardOutlined } from '@ant-design/icons';
import './BookingPage.css';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  // Get scheduleId from URL query params (preferred) or state (fallback)
  const scheduleIdFromQuery = searchParams.get('scheduleId');
  const { scheduleId: scheduleIdFromState } = location.state || {};

  // Use query param if available, otherwise fallback to state
  const scheduleId = scheduleIdFromQuery || scheduleIdFromState;

  const [showtimeSeats, setShowtimeSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // Wait for auth check

    if (!user) {
      message.warning('Vui lòng đăng nhập để tiếp tục đặt vé!');
      // Use sessionStorage for reliability
      const returnUrl = location.pathname + location.search;
      sessionStorage.setItem('returnUrl', returnUrl);
      navigate('/login');
      return;
    }

    if (!scheduleId) {
      message.error('Vui lòng chọn suất chiếu!');
      navigate('/');
      return;
    }

    bookingService.getSeatsByShowtime(scheduleId)
      .then(data => {
        setShowtimeSeats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [scheduleId, user, authLoading, navigate, location]);

  const handleSeatClick = (sts) => {
    if (sts.status !== 'AVAILABLE') return;

    // Toggle seat selection
    setSelectedSeats(prev => {
      const isSelected = prev.find(s => s.id === sts.id);
      if (isSelected) {
        return prev.filter(s => s.id !== sts.id);
      }
      // Limit max seats if necessary, e.g., 8 seats
      if (prev.length >= 8) {
        message.warning('Bạn chỉ được chọn tối đa 8 ghế!');
        return prev;
      }
      return [...prev, sts];
    });
  };

  const calculateTotal = () => selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const handleNext = () => {
    const seatIds = selectedSeats.map(s => s.seatId);
    navigate('/food', {
      state: {
        selectedSeatIds: seatIds,
        reservedSeats: selectedSeats,
        seatsPrice: calculateTotal(),
        scheduleId // Pass scheduleId to the next page
      }
    });
  };

  // Group seats by row for easier rendering if needed, or keeping grid
  // Here keeping the grid approach but refined styles

  return (
    <Layout style={{ minHeight: '100vh', background: '#ffffff' }}>
      <Content style={{ padding: '40px 20px', maxWidth: '100%', margin: '0 auto', width: '100%' }}>
        {/* Progress Steps */}
        <Steps
          current={0}
          items={[
            { title: 'Chọn Ghế', icon: <UserOutlined /> },
            { title: 'Bắp Nước', icon: <ShoppingCartOutlined /> },
            { title: 'Thanh Toán', icon: <CreditCardOutlined /> },
          ]}
          style={{ marginBottom: '40px' }}
          className="booking-steps"
        />

        <Title level={2} style={{ textAlign: 'center', color: '#e50914', marginBottom: '10px' }}>
          CHỌN GHẾ NGỒI
        </Title>
        <Text style={{ display: 'block', textAlign: 'center', color: '#8c8c8c', marginBottom: '30px' }}>
          Vui lòng chọn ghế bạn muốn đặt. Ghế màu đỏ là ghế bạn đang chọn.
        </Text>

        {/* Screen Effect */}
        <div className="screen-container">
          <div className="screen"></div>
          <Text className="screen-text">MÀN HÌNH</Text>
        </div>

        {/* Seat Map */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
        ) : (
          <div
            className="seats-grid"
            style={{
              gridTemplateColumns: `repeat(${Math.max(...showtimeSeats.map(s => s.Seat.number), 1)}, minmax(30px, 45px))`
            }}
          >
            {showtimeSeats.map(sts => {
              const isSelected = selectedSeats.find(s => s.id === sts.id);
              const seatType = sts.Seat.type || 'NORMAL';
              const rowIndex = sts.Seat.row.charCodeAt(0) - 64; // A=1, B=2

              let seatClass = 'seat-available';
              if (seatType === 'VIP') seatClass += ' seat-vip';

              if (sts.status === 'SOLD') seatClass = 'seat-sold';
              else if (sts.status === 'LOCKED') seatClass = 'seat-locked';
              else if (isSelected) seatClass = 'seat-selected';

              return (
                <Tooltip
                  key={sts.id}
                  title={`${sts.Seat.row}${sts.Seat.number} (${seatType}) - ${sts.price.toLocaleString()}đ`}
                  color="#e50914"
                >
                  <div
                    onClick={() => handleSeatClick(sts)}
                    className={`seat-item ${seatClass}`}
                    style={{
                      gridColumn: sts.Seat.number,
                      gridRow: rowIndex
                    }}
                  >
                    {sts.Seat.row}{sts.Seat.number}
                  </div>
                </Tooltip>
              );
            })}
          </div>
        )}

        {/* Seat Legend */}
        <div className="seat-legend">
          <div className="legend-item"><div className="seat-dot available"></div><span>Thường</span></div>
          <div className="legend-item"><div className="seat-dot vip"></div><span>VIP</span></div>
          <div className="legend-item"><div className="seat-dot selected"></div><span>Đang chọn</span></div>
          <div className="legend-item"><div className="seat-dot sold"></div><span>Đã bán</span></div>
        </div>
      </Content>

      {/* Sticky Footer */}
      <Footer style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 100,
        padding: '15px 50px',
        background: '#fff',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Button onClick={() => navigate(-1)} size="large" style={{ fontWeight: 'bold' }}>
            QUAY LẠI
          </Button>
          <div>
            <Text strong style={{ fontSize: '16px', marginRight: '10px' }}>Ghế đang chọn:</Text>
            <Text style={{ color: '#e50914', fontWeight: 'bold' }}>
              {selectedSeats.length > 0 ? selectedSeats.map(s => `${s.Seat.row}${s.Seat.number}`).join(', ') : 'Chưa chọn'}
            </Text>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div style={{ textAlign: 'right' }}>
            <Text style={{ display: 'block', fontSize: '14px', color: '#8c8c8c' }}>Tổng cộng</Text>
            <Text style={{ fontSize: '24px', color: '#e50914', fontWeight: 'bold', lineHeight: 1 }}>
              {calculateTotal().toLocaleString()} đ
            </Text>
          </div>
          <Button
            type="primary"
            size="large"
            danger
            onClick={handleNext}
            disabled={selectedSeats.length === 0}
            style={{ padding: '0 40px', fontWeight: 'bold', height: '50px' }}
          >
            TIẾP TỤC
          </Button>
        </div>
      </Footer>
    </Layout>
  );
};

export default BookingPage;
