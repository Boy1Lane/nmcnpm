import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import movieService from '../../services/Client/movieService';
import './Homepage.css'; // Đảm bảo đường dẫn này đúng với thư mục của bạn

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [activeTab, setActiveTab] = useState('showing');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await movieService.getAllMovies();
        // Lọc phim theo trạng thái khớp với Database
        const filtered = data.filter(m => m.status === activeTab);
        setMovies(filtered);
      } catch (err) {
        console.error("Lỗi tải phim:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [activeTab]);

  return (
    <div className="homepage">
      <div className="banner">
        <h1>CinemaVerse</h1>
      </div>

      <div className="movie-tabs">
        <button 
          className={activeTab === 'showing' ? 'active' : ''} 
          onClick={() => setActiveTab('showing')}
        >
          PHIM ĐANG CHIẾU
        </button>
        <button 
          className={activeTab === 'coming_soon' ? 'active' : ''} 
          onClick={() => setActiveTab('coming_soon')}
        >
          PHIM SẮP CHIẾU
        </button>
      </div>

      <div className="movie-list">
        {loading ? (
          <p>Đang tải phim...</p>
        ) : movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <div className="poster-wrapper">
              <Link to={`/movie/${movie.id}`}>
                <img src={movie.posterUrl} alt={movie.title} />
                <div className="overlay">
                  <span className="btn-buy-ticket">XEM CHI TIẾT</span>
                </div>
              </Link>
            </div>
            <div className="movie-info-content">
              <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
                <h3 className="movie-title">{movie.title}</h3>
              </Link>
              <div className="movie-meta">
                <p>{movie.genre || 'Hành động'}</p>
                <p>{movie.duration} phút</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;