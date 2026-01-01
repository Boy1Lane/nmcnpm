import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import movieService from '../../services/Client/movieService';
import { Layout, Row, Col, Typography, Tag, Rate, Button, Tabs, Modal, Spin, Breadcrumb } from 'antd';
import { PlayCircleOutlined, CalendarOutlined, ClockCircleOutlined, GlobalOutlined, HomeOutlined } from '@ant-design/icons';
import './MovieDetail.css';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        const data = await movieService.getMovieById(id);
        setMovie(data);
      } catch (err) {
        console.error("Lỗi xóa chi tiết phim:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMovieDetail();
  }, [id]);

  const handleShowtimeClick = (showtimeId) => {
    navigate(`/booking/${showtimeId}`);
  };

  const showTrailer = () => {
    if (movie?.trailerUrl) setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  if (loading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0a0a0a' }}><Spin size="large" /></div>;
  if (!movie) return null;

  // Nhóm lịch chiếu theo ngày (nếu có nhiều ngày) - Ở đây giữ đơn giản hiển thị list
  // Có thể mở rộng logic group showtimes by date ở đây

  return (
    <Content style={{ background: '#001529', minHeight: '100vh', color: '#fff' }}>
      {/* Hero Section */}
      <div
        className="movie-hero-section"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,21,41,0.8), #001529), url(${movie.posterUrl})`,
        }}
      >
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          <Breadcrumb
            items={[
              { title: <a href="/" style={{ color: '#aaa' }}><HomeOutlined /> Trang chủ</a> },
              { title: <span style={{ color: '#fff' }}>{movie.title}</span> }
            ]}
            style={{ marginBottom: '20px' }}
          />

          <Row gutter={[40, 40]}>
            {/* Poster */}
            <Col xs={24} md={8} lg={6}>
              <div className="movie-poster-wrapper">
                <img src={movie.posterUrl} alt={movie.title} />
              </div>
            </Col>

            {/* Info */}
            <Col xs={24} md={16} lg={18}>
              <Title level={1} style={{ color: '#fff', marginBottom: '10px' }}>{movie.title}</Title>
              <div style={{ marginBottom: '20px' }}>
                <Rate disabled defaultValue={4.5} allowHalf style={{ color: '#e50914', fontSize: '16px' }} />
                <Text style={{ color: '#aaa', marginLeft: '10px' }}>(9.0/10 - 1.2k lượt đánh giá)</Text>
              </div>

              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <Tag color="magenta" icon={<ClockCircleOutlined />}> {movie.duration} phút</Tag>
                <Tag color="volcano" icon={<CalendarOutlined />}> {new Date(movie.releaseDate).toLocaleDateString('vi-VN')}</Tag>
                <Tag color="blue" icon={<GlobalOutlined />}> {movie.genre || 'Phim Chiếu Rạp'}</Tag>
                <Tag color="green">2D/3D</Tag>
              </div>

              <Paragraph style={{ color: '#e0e0e0', fontSize: '16px', lineHeight: '1.8' }}>
                {movie.description || 'Nội dung phim đang được cập nhật. Hãy ra rạp để thưởng thức siêu phẩm này!'}
              </Paragraph>

              <div style={{ marginBottom: '25px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 20px', fontSize: '15px' }}>
                <Text strong style={{ color: '#aaa' }}>Đạo diễn:</Text>
                <Text style={{ color: '#fff' }}>{movie.director || 'Đang cập nhật'}</Text>

                <Text strong style={{ color: '#aaa' }}>Diễn viên:</Text>
                <Text style={{ color: '#fff' }}>{movie.actor || 'Đang cập nhật'}</Text>
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <Button
                  type="primary"
                  danger
                  size="large"
                  shape="round"
                  icon={<PlayCircleOutlined />}
                  onClick={showTrailer}
                  ghost
                  style={{ height: '50px', padding: '0 30px', fontSize: '16px' }}
                >
                  Xem Trailer
                </Button>
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  style={{ height: '50px', padding: '0 40px', fontSize: '16px', background: '#e50914', border: 'none' }}
                  onClick={() => {
                    document.getElementById('showtimes')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Mua Vé Ngay
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Showtimes Section */}
      <div id="showtimes" className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <Title level={3} style={{ color: '#e50914', marginBottom: '30px', borderLeft: '4px solid #e50914', paddingLeft: '15px' }}>
          LỊCH CHIẾU
        </Title>

        {movie.Showtimes && movie.Showtimes.length > 0 ? (
          <Tabs
            defaultActiveKey="1"
            type="card"
            className="showtime-tabs"
            items={[
              {
                key: '1',
                label: `Hôm nay (${new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })})`,
                children: (
                  <Row gutter={[20, 20]} style={{ marginTop: '20px' }}>
                    {movie.Showtimes.map(st => (
                      <Col xs={24} sm={12} md={8} lg={6} key={st.id}>
                        <div className="showtime-box">
                          <div className="st-cinema">{st.Room?.Cinema?.name || 'Rạp Trung Tâm'}</div>
                          <div className="st-room">{st.Room?.name}</div>
                          <div className="st-time-wrapper">
                            <Button
                              type="primary"
                              ghost
                              danger
                              block
                              style={{ height: '40px', fontWeight: 'bold' }}
                              onClick={() => handleShowtimeClick(st.id)}
                            >
                              {new Date(st.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </Button>
                            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '5px', textAlign: 'center' }}>
                              {st.basePrice?.toLocaleString()} đ
                            </Text>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                )
              },
              {
                key: '2',
                label: 'Ngày mai',
                children: <div style={{ padding: '20px', color: '#aaa', textAlign: 'center' }}>Chưa có lịch chiếu</div>
              }
            ]}
          />
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', background: '#1f1f1f', borderRadius: '8px' }}>
            <Text style={{ color: '#aaa' }}>Hiện chưa có lịch chiếu cho phim này.</Text>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      <Modal
        title={movie.title}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
        centered
        destroyOnClose
        className="trailer-modal"
      >
        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
          {/* Đảm bảo URL youtube embed đúng định dạng, hoặc dùng logic parse ID */}
          <iframe
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            src={movie.trailerUrl?.replace("watch?v=", "embed/")}
            title="Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Modal>
    </Content>
  );
};

export default MovieDetail;
