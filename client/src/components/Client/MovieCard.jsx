import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css'; 

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  // Hàm xử lý khi bấm vào thẻ phim hoặc nút đặt vé
  const handleBooking = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="movie-card-client" onClick={handleBooking}>
      <div className="poster-wrapper">
        <img 
          src={movie.poster || 'https://via.placeholder.com/300x450?text=No+Poster'} 
          alt={movie.title} 
        />
        <div className="card-overlay">
          <button className="btn-booking-now">ĐẶT VÉ</button>
        </div>
      </div>
      <div className="movie-details-brief">
        <h3 className="movie-title-client">{movie.title}</h3>
        <div className="movie-meta-client">
          <span className="genre-tag">{movie.genre}</span>
          <span className="duration-tag">{movie.duration} phút</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;