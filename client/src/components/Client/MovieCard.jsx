// client/src/components/Client/MovieCard.jsx
import React from 'react';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <div className="movie-poster">
        {/* SỬA ĐỔI: Dùng movie.posterUrl thay vì movie.poster */}
        <img 
          src={movie.posterUrl || "https://via.placeholder.com/300x450?text=No+Image"} 
          alt={movie.title} 
        />
        {/* Hiển thị nhãn nếu phim sắp chiếu */}
        {movie.status === 'coming_soon' && <span className="status-tag">Sắp chiếu</span>}
      </div>
      
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-duration">
           ⏱ {movie.duration} phút | 📅 {new Date(movie.releaseDate).toLocaleDateString('vi-VN')}
        </p>
        
        {/* Chỉ hiện nút đặt vé nếu phim ĐANG CHIẾU */}
        {movie.status === 'showing' ? (
           <button className="btn-book-ticket">Đặt Vé</button>
        ) : (
           <button className="btn-book-ticket disabled" disabled>Chưa mở bán</button>
        )}
      </div>
    </div>
  );
};

export default MovieCard;