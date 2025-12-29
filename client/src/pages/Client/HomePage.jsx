import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Điều chỉnh đường dẫn đến movieService trong folder Client
import movieService from '../../services/Client/movieService'; 
// Điều chỉnh đường dẫn đến file CSS trong folder styles/Client
import './Homepage.css';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [activeTab, setActiveTab] = useState('showing'); // 'showing' hoặc 'coming_soon'
  const [loading, setLoading] = useState(true);

  // --- GỌI API LẤY PHIM ---
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        // Gọi API lấy danh sách phim dựa theo trạng thái tab
        const data = await movieService.getAllMovies(activeTab);
        setMovies(data);
      } catch (error) {
        console.error("Lỗi tải phim:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [activeTab]); // Tự động gọi lại khi người dùng chuyển tab

  return (
    <div className="homepage">
      {/* Khu vực Banner quảng bá phim */}
      <div className="banner">
         <h1>CinemaVerse - Thế giới điện ảnh</h1>
      </div>

      {/* Tabs chuyển đổi giữa phim Đang Chiếu và Sắp Chiếu */}
      <div className="movie-tabs">
        <button 
          className={activeTab === 'showing' ? 'active' : ''} 
          onClick={() => setActiveTab('showing')}
        >
          Đang Chiếu
        </button>
        <button 
          className={activeTab === 'coming_soon' ? 'active' : ''} 
          onClick={() => setActiveTab('coming_soon')}
        >
          Sắp Chiếu
        </button>
      </div>

      {/* Danh sách hiển thị các phim */}
      <div className="movie-list">
        {loading ? (
           <div className="loading-container">Đang tải danh sách phim...</div>
        ) : movies.length === 0 ? (
           <p className="no-movie">Hiện chưa có phim nào ở mục này.</p>
        ) : (
          movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <div className="poster-wrapper">
                {/* Ảnh poster phim */}
                <img src={movie.posterUrl || 'https://via.placeholder.com/300x450'} alt={movie.title} />
                <div className="overlay">
                  {/* Đường dẫn đến trang chi tiết của từng bộ phim */}
                  <Link to={`/movie/${movie.id}`} className="btn-buy-ticket">
                    MUA VÉ
                  </Link>
                </div>
              </div>
              <div className="movie-info-content">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-meta">
                  Thời lượng: {movie.duration} phút <br/>
                  Khởi chiếu: {new Date(movie.releaseDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;