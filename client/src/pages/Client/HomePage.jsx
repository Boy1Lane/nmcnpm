import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import movieService from '../../services/Client/movieService';
import { Layout, Carousel, Tabs, Card, Row, Col, Typography, Spin, Tag, Button } from 'antd';
import { PlayCircleOutlined, ClockCircleOutlined, BarcodeOutlined } from '@ant-design/icons';
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
        setMovies(data);
      } catch (err) {
        console.error("Lỗi tải phim:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const getMoviesByStatus = (status) => movies.filter((m) => m.status === status);

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
              styles={{ body: { padding: '12px', backgroundColor: '#1f1f1f', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' } }}
              style={{ overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <Meta
                title={
                  <Title level={5} style={{ color: '#fff', marginBottom: 0, minHeight: '48px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} title={movie.title}>
                    {movie.title}
                  </Title>
                }
                description={
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'flex-end' }}>
                    <Text style={{ color: '#8c8c8c', fontSize: '13px' }}>
                      {movie.genre || 'Hành động'}
                    </Text>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
    <Content style={{ backgroundColor: '#001529', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Hero Carousel */}
      <Carousel autoplay effect="fade" style={{ marginBottom: '40px' }}>
        {banners.map((banner) => (
          <div key={banner.id}>
            <div
              style={{
                height: '500px',
                width: '100%',
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), #001529), url(${banner.image})`,
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
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <Tabs
          defaultActiveKey="showing"
          items={tabItems}
          centered
          size="large"
          tabBarStyle={{ color: '#fff' }}
          className="custom-tabs"
        />
      </div>
    </Content>
  );
};

export default HomePage;
