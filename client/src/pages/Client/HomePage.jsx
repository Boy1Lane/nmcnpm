import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import movieService from '../../services/Client/movieService';
import { Layout, Carousel, Tabs, Card, Row, Col, Typography, Spin, Tag, Button, Space } from 'antd';
import {
  PlayCircleOutlined,
  ClockCircleOutlined,
  BarcodeOutlined,
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import './Homepage.css';

const { Content } = Layout;
const { Meta } = Card;
const { Title, Paragraph, Text } = Typography;

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fake banner data (có thể thay bằng API nếu có)
  const banners = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop',
      title: 'Trải Nghiệm Điện Ảnh Đỉnh Cao',
      description: 'Hệ thống rạp chiếu phim hiện đại nhất với công nghệ IMAX.',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2670&auto=format&fit=crop',
      title: 'Bom Tấn Mới Nhất',
      description: 'Đặt vé ngay hôm nay để không bỏ lỡ những siêu phẩm.',
    },
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await movieService.getAllMovies();
        // Sort alphabetically by title
        const sortedData = data.sort((a, b) => a.title.localeCompare(b.title));
        setMovies(sortedData);
      } catch (err) {
        console.error("Lỗi tải phim:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const getMoviesByStatus = (status) => {
    return movies
      .filter((m) => m.status === status)
      .sort((a, b) => a.title.localeCompare(b.title));
  };

  const renderMovieList = (movieList) => (
    <Row gutter={[24, 24]} style={{ marginTop: 20 }}>
      {movieList.map((movie) => (
        <Col key={movie.id} xs={24} sm={12} md={8} lg={6} xl={6}>
          <Link to={`/movie/${movie.id}`}>
            <Card
              hoverable
              cover={
                <div className="poster-wrapper">
                  <img alt={movie.title} src={movie.posterUrl} loading="lazy" />
                  <div className="overlay">
                    <Button type="primary" shape="round" icon={<BarcodeOutlined />} size="large" danger>
                      Mua Vé
                    </Button>
                  </div>
                </div>
              }
              bordered={false}
              styles={{ body: { padding: '12px', backgroundColor: '#ffffff', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' } }}
              style={{ overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <Meta
                title={
                  <Title level={5} style={{ color: '#000', margin: 0, textAlign: 'center', minHeight: '40px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.2' }} title={movie.title}>
                    {movie.title}
                  </Title>
                }
                description={
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, justifyContent: 'flex-end' }}>
                    <Text style={{ color: '#595959', fontSize: '13px', textAlign: 'center', display: 'block' }}>
                      {movie.genre || 'Hành động'}
                    </Text>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <Tag color="gold" style={{ border: 'none', marginRight: 0 }}>
                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                        {movie.duration}p
                      </Tag>
                      <Tag color="red">2D</Tag>
                    </div>
                  </div>
                }
              />
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  );

  const tabItems = [
    {
      key: 'showing',
      label: 'PHIM ĐANG CHIẾU',
      children: loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
      ) : (
        renderMovieList(getMoviesByStatus('showing'))
      ),
    },
    {
      key: 'coming_soon',
      label: 'PHIM SẮP CHIẾU',
      children: loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
      ) : (
        renderMovieList(getMoviesByStatus('coming_soon'))
      ),
    },
  ];

  return (
    <Content style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Hero Carousel */}
      <Carousel autoplay effect="fade" style={{ marginBottom: '40px' }}>
        {banners.map((banner) => (
          <div key={banner.id}>
            <div
              style={{
                height: '500px',
                width: '100%',
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), #cccccc), url(${banner.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                textAlign: 'center',
              }}
            >
              <Title style={{ color: '#fff', fontSize: '48px', textShadow: '0 4px 8px rgba(0,0,0,0.6)', marginBottom: '10px' }}>
                {banner.title}
              </Title>
              <Paragraph style={{ color: '#e0e0e0', fontSize: '18px', maxWidth: '600px', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
                {banner.description}
              </Paragraph>

            </div>
          </div>
        ))}
      </Carousel>

      {/* Main Content Area */}
      <div className="container" style={{ maxWidth: '100%', margin: '0 auto', padding: '0 20px' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f0f0f0'
        }}>
          <Tabs
            defaultActiveKey="showing"
            items={tabItems}
            centered
            size="large"
            tabBarStyle={{ color: '#000' }}
            className="custom-tabs"
          />

          {/* Footer Section merged inside */}
          <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #f0f0f0' }}>
            <Row gutter={[32, 32]} justify="space-between" align="top">
              {/* Cột 1: Về CinemaVerse */}
              <Col xs={24} sm={12} md={8}>
                <Title level={4} style={{ color: '#e50914', marginTop: 0 }}>
                  CinemaVerse
                </Title>
                <Text style={{ color: '#595959', display: 'block', marginBottom: '16px' }}>
                  Trải nghiệm điện ảnh đỉnh cao với âm thanh sống động và hình ảnh sắc nét.
                  Đặt vé dễ dàng, ưu đãi hấp dẫn.
                </Text>
                <Text style={{ color: '#8c8c8c' }}>
                  &copy; {new Date().getFullYear()} CinemaVerse. All rights reserved.
                </Text>
              </Col>

              {/* Cột 2: Liên hệ */}
              <Col xs={24} sm={12} md={8} style={{ textAlign: 'left' }}>
                <Title level={4} style={{ color: '#000', marginTop: 0 }}>
                  Liên hệ
                </Title>
                <Space style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} size="middle">
                  <Text style={{ color: '#595959' }}>
                    <EnvironmentOutlined style={{ marginRight: '8px', color: '#e50914' }} />
                    123 Đường Điện Ảnh, Hà Nội
                  </Text>
                  <Text style={{ color: '#595959' }}>
                    <PhoneOutlined style={{ marginRight: '8px', color: '#e50914' }} />
                    1900 1234
                  </Text>
                  <Text style={{ color: '#595959' }}>
                    <MailOutlined style={{ marginRight: '8px', color: '#e50914' }} />
                    support@cinemaverse.com
                  </Text>
                </Space>
              </Col>

              {/* Cột 3: Kết nối */}
              <Col xs={24} sm={12} md={8}>
                <Title level={4} style={{ color: '#000', marginTop: 0 }}>
                  Kết nối với chúng tôi
                </Title>
                <Space size="large">
                  <a href="#" target="_blank" rel="noreferrer" style={{ color: '#333', fontSize: '24px' }}>
                    <FacebookOutlined />
                  </a>
                  <a href="#" target="_blank" rel="noreferrer" style={{ color: '#333', fontSize: '24px' }}>
                    <InstagramOutlined />
                  </a>
                  <a href="#" target="_blank" rel="noreferrer" style={{ color: '#333', fontSize: '24px' }}>
                    <TwitterOutlined />
                  </a>
                </Space>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Content>
  );
};

export default HomePage;
