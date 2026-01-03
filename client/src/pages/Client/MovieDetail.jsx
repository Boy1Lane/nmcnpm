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
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);


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
    navigate('/booking', { state: { scheduleId: showtimeId } });
  };

  const showTrailer = () => {
    if (movie?.trailerUrl) setIsTrailerModalOpen(true);
  };

  const handleCancel = () => {
    setIsTrailerModalOpen(false);
  };



  if (loading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0a0a0a' }}><Spin size="large" /></div>;
  if (!movie) return null;

  // Nhóm lịch chiếu theo ngày (nếu có nhiều ngày) - Ở đây giữ đơn giản hiển thị list
  // Có thể mở rộng logic group showtimes by date ở đây

  return (
    <Content style={{ background: 'transparent', minHeight: '100vh', color: '#000' }}>
      {/* Hero Section */}
      <div
        className="movie-hero-section"
        style={{
          paddingTop: '30px',
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), #cccccc), url(${movie.posterUrl})`,
        }}
      >
        <div className="container" style={{
          maxWidth: '100%',
          margin: '0 auto',
          padding: '40px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #f0f0f0',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Breadcrumb đã được lược bỏ để tên App đóng vai trò nút Home */}

          <Row gutter={[40, 40]}>
            {/* Poster */}
            <Col xs={24} md={8} lg={6}>
              <div className="movie-poster-wrapper" style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <img src={movie.posterUrl} alt={movie.title} style={{ width: '100%', display: 'block' }} />
              </div>
            </Col>

            {/* Info */}
            <Col xs={24} md={16} lg={18}>
              <Title level={1} style={{ color: '#000', marginBottom: '10px' }}>{movie.title}</Title>
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <Rate disabled defaultValue={4.5} allowHalf style={{ color: '#e50914', fontSize: '16px' }} />
                <Text style={{ color: '#595959', marginLeft: '10px' }}>(9.0/10 - 1.2k lượt đánh giá)</Text>
              </div>

              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <Tag color="magenta" icon={<ClockCircleOutlined />}> {movie.duration} phút</Tag>
                <Tag color="volcano" icon={<CalendarOutlined />}> {new Date(movie.releaseDate).toLocaleDateString('vi-VN')}</Tag>
                <Tag color="blue" icon={<GlobalOutlined />}> {movie.genre || 'Phim Chiếu Rạp'}</Tag>
                <Tag color="green">2D/3D</Tag>
              </div>

              <Paragraph style={{ color: '#333', fontSize: '16px', lineHeight: '1.8' }}>
                {movie.description || 'Nội dung phim đang được cập nhật. Hãy ra rạp để thưởng thức siêu phẩm này!'}
              </Paragraph>

              <div style={{ marginBottom: '25px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 20px', fontSize: '15px' }}>
                <Text strong style={{ color: '#595959' }}>Đạo diễn:</Text>
                <Text style={{ color: '#000' }}>{movie.director || 'Đang cập nhật'}</Text>

                <Text strong style={{ color: '#595959' }}>Diễn viên:</Text>
                <Text style={{ color: '#000' }}>{movie.actor || 'Đang cập nhật'}</Text>
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>

                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  style={{ height: '50px', padding: '0 40px', fontSize: '16px', background: '#e50914', border: 'none', boxShadow: '0 4px 14px rgba(229, 9, 20, 0.4)' }}
                  onClick={() => {
                    document.getElementById('showtimes')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Mua Vé Ngay
                </Button>

                {movie.trailerUrl && (
                  <Button
                    size="large"
                    shape="round"
                    icon={<PlayCircleOutlined />}
                    style={{ height: '50px', padding: '0 30px', fontSize: '16px' }}
                    onClick={showTrailer}
                  >
                    Xem Trailer
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Showtimes Section */}
      <div id="showtimes" className="container" style={{ maxWidth: '100%', margin: '40px auto', padding: '0 20px' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '30px',
          border: '1px solid #f0f0f0',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
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
                              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '5px', textAlign: 'center', color: '#595959' }}>
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
                  children: <div style={{ padding: '20px', color: '#595959', textAlign: 'center' }}>Chưa có lịch chiếu</div>
                }
              ]}
            />
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', background: '#f5f5f5', borderRadius: '8px' }}>
              <Text style={{ color: '#595959' }}>Hiện chưa có lịch chiếu cho phim này.</Text>
            </div>
          )}
        </div>
      </div>



      {/* Trailer Modal */}
      <Modal
        title={movie.title}
        open={isTrailerModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
        centered
        destroyOnHidden
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
