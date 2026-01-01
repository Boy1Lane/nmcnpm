import React from 'react';
import { Layout, Row, Col, Typography, Space } from 'antd';
import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const Footer = () => {
  return (
    <AntFooter
      style={{
        backgroundColor: '#001529',
        color: '#fff',
        padding: '40px 0', // Bỏ padding ngang ở ngoài
        borderTop: '1px solid #333',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <Row gutter={[32, 32]}>
          {/* Cột 1: Về CinemaVerse */}
          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ color: '#e50914' }}>
              CinemaVerse
            </Title>
            <Text style={{ color: '#bfbfbf', display: 'block', marginBottom: '16px' }}>
              Trải nghiệm điện ảnh đỉnh cao với âm thanh sống động và hình ảnh sắc nét.
              Đặt vé dễ dàng, ưu đãi hấp dẫn.
            </Text>
            <Text style={{ color: '#8c8c8c' }}>
              &copy; {new Date().getFullYear()} CinemaVerse. All rights reserved.
            </Text>
          </Col>

          {/* Cột 2: Liên hệ */}
          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ color: '#fff' }}>
              Liên hệ
            </Title>
            <Space style={{ display: 'flex', flexDirection: 'column' }} size="middle">
              <Text style={{ color: '#bfbfbf' }}>
                <EnvironmentOutlined style={{ marginRight: '8px', color: '#e50914' }} />
                123 Đường Điện Ảnh, Hà Nội
              </Text>
              <Text style={{ color: '#bfbfbf' }}>
                <PhoneOutlined style={{ marginRight: '8px', color: '#e50914' }} />
                1900 1234
              </Text>
              <Text style={{ color: '#bfbfbf' }}>
                <MailOutlined style={{ marginRight: '8px', color: '#e50914' }} />
                support@cinemaverse.com
              </Text>
            </Space>
          </Col>

          {/* Cột 3: Kết nối */}
          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ color: '#fff' }}>
              Kết nối với chúng tôi
            </Title>
            <Space size="large">
              <Link href="#" target="_blank" style={{ color: '#fff', fontSize: '24px' }}>
                <FacebookOutlined />
              </Link>
              <Link href="#" target="_blank" style={{ color: '#fff', fontSize: '24px' }}>
                <InstagramOutlined />
              </Link>
              <Link href="#" target="_blank" style={{ color: '#fff', fontSize: '24px' }}>
                <TwitterOutlined />
              </Link>
            </Space>
          </Col>
        </Row>
      </div>
    </AntFooter>
  );
};

export default Footer;
