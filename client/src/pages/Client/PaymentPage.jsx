import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import bookingService from '../../services/Client/bookingService';
import { Layout, Steps, Card, Button, Typography, message, Descriptions, Input, Divider, Row, Col, Space } from 'antd';
import { UserOutlined, ShoppingCartOutlined, CreditCardOutlined, GiftOutlined } from '@ant-design/icons';
import './PaymentPage.css';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { selectedSeatIds, reservedSeats, seatsPrice, selectedFoods, scheduleId } = state || {};

  const [promotionCode, setPromotionCode] = useState('');
  const [loading, setLoading] = useState(false);

  if (!state) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>
        <Title level={3} style={{ color: '#fff' }}>Không tìm thấy thông tin đặt vé</Title>
        <Button onClick={() => navigate('/')} type="primary">Về trang chủ</Button>
      </div>
    );
  }

  const foodTotal = selectedFoods ? selectedFoods.reduce((acc, item) => acc + (item.price * item.quantity), 0) : 0;
  const subTotal = (seatsPrice || 0) + foodTotal;

  const handlePayment = async () => {
    try {
      setLoading(true);

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
        scheduleId, // scheduleId must be passed in state
        selectedSeatIds,
        'CASH',
        foodItemsPayload,
        promotionCode
      );

      const bookingId = createRes.booking.id;
      message.success("Đã tạo đơn hàng thành công!");

      await bookingService.confirmBooking(bookingId);

      message.success("Thanh toán thành công!");
      navigate('/ticket-success', { state: { bookingId } });

    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Thanh toán thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#001529' }}>
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
          XÁC NHẬN ĐƠN HÀNG
        </Title>

        <Row gutter={40}>
          {/* Cột thông tin chi tiết */}
          <Col xs={24} md={16}>
            <Card title="Chi tiết đặt vé" bordered={false} style={{ background: '#fff', marginBottom: '20px' }}>
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

            <Card title="Khuyến mãi" bordered={false} style={{ background: '#fff' }}>
              <Space>
                <Input
                  prefix={<GiftOutlined />}
                  placeholder="Nhập mã khuyến mãi"
                  value={promotionCode}
                  onChange={(e) => setPromotionCode(e.target.value)}
                  style={{ width: '300px' }}
                />
                <Button>Áp dụng</Button>
              </Space>
            </Card>
          </Col>

          {/* Cột Tổng tiền & Thanh toán */}
          <Col xs={24} md={8}>
            <Card style={{ background: '#1f1f1f', border: '1px solid #333', color: '#fff' }}>
              <Title level={4} style={{ color: '#fff', marginBottom: '20px' }}>TỔNG CỘNG</Title>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <Text style={{ color: '#bfbfbf' }}>Tạm tính:</Text>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{subTotal.toLocaleString()} đ</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <Text style={{ color: '#bfbfbf' }}>Giảm giá:</Text>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>0 đ</Text>
              </div>
              <Divider style={{ borderColor: '#444', margin: '15px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Title level={3} style={{ color: '#e50914', margin: 0 }}>{subTotal.toLocaleString()} đ</Title>
              </div>

              <Button
                type="primary"
                size="large"
                block
                danger
                onClick={handlePayment}
                loading={loading}
                style={{ height: '50px', fontSize: '18px', fontWeight: 'bold' }}
              >
                THANH TOÁN
              </Button>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default PaymentPage;
