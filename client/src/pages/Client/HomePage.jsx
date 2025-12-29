import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import movieService from '../../services/movieService'; // Import service
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
        // Gọi API với status tương ứng tab đang chọn
        const data = await movieService.getAllMovies(activeTab);
        setMovies(data);
      } catch (error) {
        console.error("Lỗi tải phim:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [activeTab]); // Chạy lại khi đổi tab

  return (
    <div className="homepage">
      {/* Banner / Slider (Giữ nguyên code cũ của bạn nếu có) */}
      <div className="banner">
         <h1>CinemaVerse - Thế giới điện ảnh</h1>
      </div>

      {/* Tabs chuyển đổi */}
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

      {/* Danh sách phim */}
      <div className="movie-list">
        {loading ? (
           <p>Đang tải danh sách phim...</p>
        ) : movies.length === 0 ? (
           <p>Hiện chưa có phim nào ở mục này.</p>
        ) : (
          movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <div className="poster-wrapper">
                <img src={movie.posterUrl} alt={movie.title} />
                <div className="overlay">
                  {/* Link dẫn đến trang chi tiết phim */}
                  <Link to={`/movie/${movie.id}`} className="btn-buy-ticket">
                    MUA VÉ
                  </Link>
                </div>
              </div>
              <h3 className="movie-title">{movie.title}</h3>
              <p className="movie-info">
                Thời lượng: {movie.duration} phút <br/>
                Khởi chiếu: {new Date(movie.releaseDate).toLocaleDateString('vi-VN')}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;