import React, { useState, useEffect } from 'react';
import { Input, Row, Col, Typography, Spin, Alert, Empty } from 'antd';
import axiosInstance from '../../api/axiosInstance';
import MovieCard from '../../components/MovieCard'; // ✅ Đường dẫn này đã được xác nhận là đúng

const { Title } = Typography;
const { Search } = Input;

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Dữ liệu giả lập (sử dụng khi Server lỗi)
  const mockMovies = [
    { id: 1, name: 'Tử Thần Khôn Lường', director: 'Steven Spielberg', duration: 120, posterUrl: 'https://via.placeholder.com/400x600/1890ff/FFFFFF?text=Phim+A' },
    { id: 2, name: 'Sứ Mệnh Thần Tốc', director: 'James Cameron', duration: 95, posterUrl: 'https://via.placeholder.com/400x600/eb2f96/FFFFFF?text=Phim+B' },
    { id: 3, name: 'Hành Tinh Lửa', director: 'Quốc Huy', duration: 150, posterUrl: 'https://via.placeholder.com/400x600/52c41a/FFFFFF?text=Phim+C' },
    { id: 4, name: 'Phép Thuật Mùa Đông', director: 'Nguyễn Duy Khánh', duration: 105, posterUrl: 'https://via.placeholder.com/400x600/fadb14/FFFFFF?text=Phim+D' },
  ];

  const fetchMovies = async (searchQuery = '') => {
    setLoading(true);
    setError(null);
    try {
      // Gọi API lấy danh sách phim: GET /movies?search=<query>
      const response = await axiosInstance.get(`/movies`, {
        params: { search: searchQuery }
      });
      // Nếu API trả về dữ liệu
      setMovies(response.data); 
      
    } catch (err) {
      console.error("Lỗi lấy danh sách phim:", err);
      // Sử dụng dữ liệu giả lập nếu API gặp lỗi
      setMovies(mockMovies.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))); 
      setError("Không thể tải danh sách phim từ Server. Đang sử dụng dữ liệu giả lập.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    fetchMovies(value); // Gọi lại API khi tìm kiếm
  };

  if (loading && movies.length === 0 && !error) {
    return <Spin tip="Đang tải danh sách phim..." size="large" style={{ display: 'block', margin: '50px auto' }} />;
  }

  return (
    <div>
      <Title level={2} style={{ textAlign: 'center' }}>Phim Đang Chiếu</Title>
      
      {/* Thanh tìm kiếm */}
      <Search
        placeholder="Tìm kiếm phim theo tên..."
        allowClear
        enterButton="Tìm kiếm"
        size="large"
        onSearch={handleSearch}
        loading={loading}
        style={{ marginBottom: 30 }}
      />

      {error && <Alert message="Cảnh báo" description={error} type="warning" showIcon closable style={{ marginBottom: 20 }} />}
      
      {movies.length === 0 && !loading ? (
        <Empty description="Không tìm thấy phim nào." />
      ) : (
        /* Hiển thị danh sách phim dạng Grid */
        <Row gutter={[24, 24]}>
          {movies.map(movie => (
            <Col key={movie.id} xs={24} sm={12} md={8} lg={6}>
              <MovieCard movie={movie} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default HomePage;