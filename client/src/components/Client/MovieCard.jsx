import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Bắt buộc phải có dòng này
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate(); // 2. Khai báo hàm điều hướng

  // Hàm xử lý chuyển trang
  const handleBooking = () => {
    // Chuyển hướng đến đường dẫn: /movie/ID_CỦA_PHIM
    navigate(`/movie/${movie.id}`);
  };

  return (
    // 3. Gắn sự kiện onClick vào thẻ bao ngoài cùng
    <div 
      className="movie-card" 
      onClick={handleBooking} 
      style={{ cursor: 'pointer' }} // Thêm con trỏ tay để biết là bấm được
    >
      <div className="movie-poster">
        <img 
          src={movie.posterUrl || "https://via.placeholder.com/300x450"} 
          alt={movie.title} 
        />
        {movie.status === 'coming_soon' && <span className="status-tag">Sắp chiếu</span>}
      </div>
      
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-duration">
           ⏱ {movie.duration} phút | 📅 {movie.releaseDate}
        </p>
        
        {/* 4. Nút bấm cũng gọi hàm handleBooking nhưng chặn sự kiện nổi bọt */}
        <button 
            className="btn-book-ticket" 
            onClick={(e) => {
                e.stopPropagation(); // Ngăn không cho click lan ra thẻ cha (tránh bị click 2 lần)
                handleBooking();
            }}
        >
            Đặt Vé
        </button>
      </div>
    </div>
  );
};

export default MovieCard;