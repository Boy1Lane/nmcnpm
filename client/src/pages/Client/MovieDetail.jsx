import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Điều chỉnh đường dẫn đến movieService trong folder Client
import movieService from '../../services/Client/movieService';
// Điều chỉnh đường dẫn đến file CSS trong folder styles/Client
import './MovieDetail.css'; 

const MovieDetail = () => {
  const { id } = useParams(); // Lấy ID phim từ URL
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 1. GỌI API LẤY CHI TIẾT PHIM & LỊCH CHIẾU ---
  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        // Gọi API lấy chi tiết phim từ service dành cho khách hàng
        const data = await movieService.getMovieById(id);
        setMovie(data);
      } catch (err) {
        console.error("Lỗi tải chi tiết phim:", err);
        setError("Không tìm thấy thông tin phim.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMovieDetail();
  }, [id]);

  // --- 2. XỬ LÝ KHI BẤM VÀO SUẤT CHIẾU ---
  const handleShowtimeClick = (showtimeId) => {
    // Chuyển hướng sang trang đặt vé với ID của suất chiếu tương ứng
    navigate(`/booking/${showtimeId}`);
  };

  // --- 3. CÁC HÀM ĐỊNH DẠNG THỜI GIAN ---
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' });
  };

  if (loading) return <div className="loading-container">Đang tải dữ liệu phim...</div>;
  if (error) return <div className="error-container">{error}</div>;
  if (!movie) return null;

  return (
    <div className="movie-detail-container">
      {/* PHẦN 1: THÔNG TIN PHIM - HIỂN THỊ DẠNG HERO BANNER */}
      <div className="movie-hero" style={{ backgroundImage: `url(${movie.posterUrl})` }}>
        <div className="movie-hero-overlay">
          <div className="movie-poster">
            <img src={movie.posterUrl || 'https://via.placeholder.com/300x450'} alt={movie.title} />
          </div>
          <div className="movie-info-content">
            <h1 className="movie-title">{movie.title}</h1>
            <p className="movie-meta">
              <span>{movie.duration} phút</span> • 
              <span> {new Date(movie.releaseDate).toLocaleDateString('vi-VN')}</span> • 
              <span> {movie.genre || 'Phim chiếu rạp'}</span>
            </p>
            
            <div className="movie-description">
              <h3>Nội dung</h3>
              <p>{movie.description || 'Thông tin nội dung đang được cập nhật...'}</p>
            </div>

            <div className="movie-crew">
              <p><strong>Đạo diễn:</strong> {movie.director || 'Đang cập nhật'}</p>
              <p><strong>Diễn viên:</strong> {movie.actor || 'Đang cập nhật'}</p>
            </div>
            
            {movie.trailerUrl && (
              <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer" className="btn-trailer">
                ▶ Xem Trailer
              </a>
            )}
          </div>
        </div>
      </div>

      {/* PHẦN 2: LỊCH CHIẾU - KẾT NỐI VỚI DỮ LIỆU SUẤT CHIẾU TRONG DATABASE */}
      <div className="showtimes-section">
        <h2 className="section-title">Lịch Chiếu</h2>
        
        {movie.Showtimes && movie.Showtimes.length > 0 ? (
          <div className="showtime-list">
             {movie.Showtimes.map((showtime) => (
                <div key={showtime.id} className="showtime-card">
                   <div className="showtime-info">
                      <span className="cinema-name">
                        {showtime.Room?.Cinema?.name || "Rạp CinemaVerse"} - {showtime.Room?.name}
                      </span>
                      <span className="showtime-date">{formatDate(showtime.startTime)}</span>
                   </div>
                   <div className="showtime-action">
                     <button 
                        className="btn-time"
                        onClick={() => handleShowtimeClick(showtime.id)}
                     >
                        {formatTime(showtime.startTime)}
                     </button>
                     <span className="price-tag">{showtime.basePrice?.toLocaleString()} đ</span>
                   </div>
                </div>
             ))}
          </div>
        ) : (
          <p className="no-showtime">Hiện chưa có lịch chiếu cho phim này. Vui lòng quay lại sau.</p>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;