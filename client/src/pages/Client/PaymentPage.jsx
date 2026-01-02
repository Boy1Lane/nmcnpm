import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import bookingService from '../../services/Client/bookingService';
import { Layout, Steps, Card, Button, Typography, message, Descriptions, Input, Divider, Row, Col, Space, Radio } from 'antd';
import { UserOutlined, ShoppingCartOutlined, CreditCardOutlined, GiftOutlined } from '@ant-design/icons';
import './PaymentPage.css';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { selectedSeatIds, reservedSeats, seatsPrice, selectedFoods, scheduleId } = state || {};

  const [promotionCode, setPromotionCode] = useState('');
  const [discount, setDiscount] = useState(0); // percentage
  const [paymentMethod, setPaymentMethod] = useState('BANKING');
  const [loading, setLoading] = useState(false);
  const [checkingCode, setCheckingCode] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState(null);

  if (!state) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: '#000' }}>
        <Title level={3} style={{ color: '#000' }}>Không tìm thấy thông tin đặt vé</Title>
        <Button onClick={() => navigate('/')} type="primary">Về trang chủ</Button>
      </div>
    );
  }

  const foodTotal = selectedFoods ? selectedFoods.reduce((acc, item) => acc + (item.price * item.quantity), 0) : 0;
  const subTotal = (seatsPrice || 0) + foodTotal;
  const discountAmount = Math.round((subTotal * discount) / 100);
  const finalTotal = subTotal - discountAmount;

  const handleApplyPromotion = async () => {
    if (!promotionCode.trim()) {
      message.error("Vui lòng nhập mã khuyến mãi!");
      return;
    }
    try {
      setCheckingCode(true);
      const res = await bookingService.checkPromotion(promotionCode);
      if (res.success) {
        setDiscount(res.data.discountPercentage);
        message.success(`Áp dụng mã thành công! Giảm ${res.data.discountPercentage}%`);
      }
    } catch (err) {
      console.error(err);
      setDiscount(0);
      message.error(err.response?.data?.message || "Mã khuyến mãi không hợp lệ");
    } finally {
      setCheckingCode(false);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Step 2: Confirmation after scanning QR
      if (showQR && createdBookingId) {
        await bookingService.confirmBooking(createdBookingId);
        message.success("Thanh toán thành công!");
        navigate('/ticket-success', { state: { bookingId: createdBookingId } });
        return;
      }

      // Step 1: Create Booking and Show QR
      const foodItemsPayload = selectedFoods ? selectedFoods.map(f => ({
        foodId: f.id,
        quantity: f.quantity
      })) : [];

      if (!selectedSeatIds || selectedSeatIds.length === 0) {
        message.error("Vui lòng chọn ghế!");
        setLoading(false);
        return;
      }

      const createRes = await bookingService.createBooking(
        scheduleId,
        selectedSeatIds,
        paymentMethod,
        foodItemsPayload,
        promotionCode
      );

      const bookingId = createRes.booking.id;
      setCreatedBookingId(bookingId);
      setShowQR(true);
      message.success("Đơn hàng đã được tạo. Vui lòng quét mã QR để thanh toán.");

    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Thanh toán thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#ffffff' }}>
      <Content style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <Steps
          current={2}
          items={[
            { title: 'Chọn Ghế', icon: <UserOutlined /> },
            { title: 'Bắp Nước', icon: <ShoppingCartOutlined /> },
            { title: 'Thanh Toán', icon: <CreditCardOutlined /> },
          ]}
          style={{ marginBottom: '40px' }}
          className="booking-steps"
        />

        <Title level={2} style={{ textAlign: 'center', color: '#e50914', marginBottom: '40px' }}>
          XÁC NHẬN THÔNG TIN ĐẶT VÉ
        </Title>

        <Row gutter={40}>
          {/* Cột thông tin chi tiết */}
          <Col xs={24} md={16}>
            <Card title="Chi tiết đặt vé" variant="borderless" style={{ background: '#fff', marginBottom: '20px', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Ghế đã chọn">
                  {reservedSeats && reservedSeats.map(s => <span key={s.id} style={{ marginRight: '8px', fontWeight: 'bold' }}>{s.Seat.row}{s.Seat.number}</span>)}
                </Descriptions.Item>
                <Descriptions.Item label="Giá vé">
                  {seatsPrice?.toLocaleString()} đ
                </Descriptions.Item>
                <Descriptions.Item label="Bắp & Nước">
                  {selectedFoods && selectedFoods.length > 0 ? (
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                      {selectedFoods.map((f, idx) => (
                        <li key={idx}>
                          {f.name} x {f.quantity} = {(f.price * f.quantity).toLocaleString()} đ
                        </li>
                      ))}
                    </ul>
                  ) : 'Không chọn'}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Khuyến mãi" variant="borderless" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
              <Space>
                <Input
                  prefix={<GiftOutlined />}
                  placeholder="Nhập mã khuyến mãi"
                  value={promotionCode}
                  onChange={(e) => setPromotionCode(e.target.value)}
                  style={{ width: '300px' }}
                />
                <Button type="primary" onClick={handleApplyPromotion} loading={checkingCode}>Áp dụng</Button>
              </Space>
            </Card>
          </Col>

          {/* Cột Tổng tiền & Thanh toán */}
          <Col xs={24} md={8}>
            <Card style={{ background: '#ffffff', border: '1px solid #f0f0f0', color: '#000', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Title level={4} style={{ color: '#000', marginBottom: '20px', textAlign: 'center' }}>TỔNG CỘNG</Title>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <Text style={{ color: '#595959' }}>Tạm tính:</Text>
                <Text style={{ color: '#000', fontWeight: 'bold' }}>{subTotal.toLocaleString()} đ</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <Text style={{ color: '#595959' }}>Giảm giá:</Text>
                <Text style={{ color: '#000', fontWeight: 'bold' }}>- {discountAmount.toLocaleString()} đ</Text>
              </div>
              <Divider style={{ borderColor: '#f0f0f0', margin: '15px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <Title level={3} style={{ color: '#e50914', margin: 0 }}>{finalTotal.toLocaleString()} đ</Title>
              </div>



              {showQR && (
                <div style={{ background: '#f9f9f9', padding: 10, borderRadius: 8, marginBottom: 20, textAlign: 'center', border: '1px solid #f0f0f0' }}>
                  <Text strong>Quét mã để thanh toán:</Text>
                  <div style={{ margin: '10px 0', height: 150, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Placeholder for QR Code */}
                    <span style={{ color: '#000' }}>QR CODE</span>
                  </div>
                  <Text type="secondary">Nội dung: {createdBookingId ? `Thanh toán vé #${createdBookingId}` : 'Vui lòng ghi mã đặt vé'}</Text>
                </div>
              )}

              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Button
                  type="primary"
                  size="large"
                  block
                  danger
                  onClick={handlePayment}
                  loading={loading}
                  style={{ height: '50px', fontSize: '18px', fontWeight: 'bold' }}
                >
                  {showQR ? 'ĐÃ CHUYỂN KHOẢN' : 'THANH TOÁN'}
                </Button>
                <Button
                  block
                  size="large"
                  onClick={() => navigate(-1)}
                  style={{ height: '40px' }}
                >
                  QUAY LẠI
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default PaymentPage;
