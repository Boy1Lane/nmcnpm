import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import bookingService from '../../services/Client/bookingService';
import { Layout, Steps, Card, Row, Col, Button, Typography, Spin, Divider, Badge } from 'antd';
import { UserOutlined, ShoppingCartOutlined, CreditCardOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import './ConcessionsPage.css';

const { Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const ConcessionsPage = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { selectedSeatIds, seatsPrice, reservedSeats } = location.state || {};

  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const data = await bookingService.getFoods();
        setFoods(data);
      } catch (error) {
        console.error("Lỗi tải combo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const updateQuantity = (foodId, delta) => {
    setCart(prev => {
      const currentQty = prev[foodId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      return { ...prev, [foodId]: newQty };
    });
  };

  const calculateFoodTotal = () => {
    return foods.reduce((total, food) => {
      const qty = cart[food.id] || 0;
      return total + (food.price * qty);
    }, 0);
  };

  const foodTotal = calculateFoodTotal();
  const finalTotal = (seatsPrice || 0) + foodTotal;

  const handleNext = () => {
    const selectedFoods = foods
      .filter(food => cart[food.id] > 0)
      .map(food => ({
        id: food.id,
        name: food.name,
        price: food.price,
        quantity: cart[food.id]
      }));

    navigate(`/payment`, {
      state: {
        selectedSeatIds,
        reservedSeats,
        seatsPrice,
        selectedFoods,
        scheduleId
      }
    });
  };

  if (!location.state) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', color: '#fff' }}>
        <Title level={3} style={{ color: '#fff' }}>Vui lòng chọn ghế trước!</Title>
        <Button onClick={() => navigate(-1)} type="primary">Quay lại</Button>
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#001529' }}>
      <Content style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <Steps
          current={1}
          items={[
            { title: 'Chọn Ghế', icon: <UserOutlined /> },
            { title: 'Bắp Nước', icon: <ShoppingCartOutlined /> },
            { title: 'Thanh Toán', icon: <CreditCardOutlined /> },
          ]}
          style={{ marginBottom: '40px' }}
          className="booking-steps"
        />

        <Title level={2} style={{ textAlign: 'center', color: '#e50914', marginBottom: '40px' }}>
          CHỌN BẮP & NƯỚC
        </Title>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
        ) : (
          <Row gutter={[24, 24]}>
            {foods.map(item => (
              <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  style={{ background: '#1f1f1f', borderColor: '#333', overflow: 'hidden' }}
                  cover={
                    <div style={{ height: '150px', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
                      {/* Placeholder Image because API might not return image url yet */}
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=2670&auto=format&fit=crop"}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  }
                >
                  <Meta
                    title={<span style={{ color: '#fff' }}>{item.name}</span>}
                    description={
                      <div>
                        <Paragraph ellipsis={{ rows: 2 }} style={{ color: '#bfbfbf', minHeight: '44px' }}>
                          {item.items || 'Combo hấp dẫn cho trải nghiệm điện ảnh tuyệt vời.'}
                        </Paragraph>
                        <Title level={4} style={{ color: '#e50914', margin: '10px 0' }}>
                          {item.price.toLocaleString()} đ
                        </Title>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginTop: '15px' }}>
                          <Button
                            shape="circle"
                            icon={<MinusOutlined />}
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={!cart[item.id]}
                          />
                          <span style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>
                            {cart[item.id] || 0}
                          </span>
                          <Button
                            type="primary"
                            shape="circle"
                            icon={<PlusOutlined />}
                            onClick={() => updateQuantity(item.id, 1)}
                            danger
                          />
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Content>

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
        <div style={{ display: 'flex', gap: '40px' }}>
          <div>
            <Text type="secondary">Ghế: </Text>
            <Text strong>{seatsPrice?.toLocaleString()} đ</Text>
          </div>
          <div>
            <Text type="secondary">Bắp nước: </Text>
            <Text strong>{foodTotal.toLocaleString()} đ</Text>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div>
            <Text>Tổng cộng: </Text>
            <Text style={{ fontSize: '20px', color: '#e50914', fontWeight: 'bold' }}>
              {finalTotal.toLocaleString()} đ
            </Text>
          </div>
          <Button
            type="primary"
            size="large"
            danger
            onClick={handleNext}
            style={{ padding: '0 40px', fontWeight: 'bold' }}
          >
            THANH TOÁN
          </Button>
        </div>
      </Footer>
    </Layout>
  );
};

export default ConcessionsPage;
