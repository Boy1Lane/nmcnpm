import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  // --- KHO DỮ LIỆU GIẢ (MOCK DATA) - Đã đồng bộ 12 phim từ Homepage ---
  const mockMovies = [
    { 
      id: 1, 
      title: "Inception", 
      posterUrl: "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg", 
      description: "Dom Cobb là một đạo chích bậc thầy, có khả năng đánh cắp những bí mật quý giá nhất từ tiềm thức của đối tượng trong khi họ đang mơ.",
      genre: "Khoa học viễn tưởng, Hành động",
      duration: 148,
      releaseDate: "2010-07-16",
      rating: 8.8,
      reviews: [{ user: "Tùng", comment: "Hack não thực sự!", star: 5 }]
    },
    { 
      id: 2, 
      title: "Interstellar", 
      posterUrl: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg", 
      description: "Một nhóm các nhà thám hiểm sử dụng một lỗ sâu mới được phát hiện để vượt qua các giới hạn của việc du hành không gian của con người.",
      genre: "Khoa học viễn tưởng, Phiêu lưu",
      duration: 169,
      releaseDate: "2014-11-07",
      rating: 8.6,
      reviews: [{ user: "Nam", comment: "Nhạc phim quá đỉnh.", star: 5 }]
    },
    { 
      id: 3, 
      title: "The Dark Knight", 
      posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", 
      description: "Batman, Trung úy Gordon và Luật sư Harvey Dent phải đối mặt với một tên tội phạm điên loạn được biết đến với cái tên Joker.",
      genre: "Hành động, Tội phạm",
      duration: 152,
      releaseDate: "2008-07-18",
      rating: 9.0,
      reviews: [{ user: "Huy", comment: "Joker diễn quá đạt.", star: 5 }]
    },
    { 
      id: 4, 
      title: "Avatar: The Way of Water", 
      posterUrl: "https://upload.wikimedia.org/wikipedia/en/5/54/Avatar_The_Way_of_Water_poster.jpg", 
      description: "Jake Sully sống cùng gia đình mới của mình hình thành trên hành tinh Pandora. Một mối đe dọa quen thuộc quay trở lại...",
      genre: "Hành động, Phiêu lưu",
      duration: 192,
      releaseDate: "2022-12-16",
      rating: 7.8,
      reviews: [{ user: "Minh", comment: "Kỹ xảo mãn nhãn.", star: 4 }]
    },
    { 
      id: 5, 
      title: "Avengers: Endgame", 
      posterUrl: "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg", 
      description: "Sau sự kiện tàn khốc của Infinity War, vũ trụ đi vào tàn lụi. Với sự giúp đỡ của các đồng minh còn lại, Avengers tập hợp một lần nữa.",
      genre: "Siêu anh hùng, Hành động",
      duration: 181,
      releaseDate: "2019-04-26",
      rating: 8.4,
      reviews: [{ user: "Thảo", comment: "Cảnh cuối khóc hết nước mắt.", star: 5 }]
    },
    { 
      id: 6, 
      title: "Oppenheimer", 
      posterUrl: "https://upload.wikimedia.org/wikipedia/en/4/4a/Oppenheimer_%28film%29.jpg", 
      description: "Câu chuyện về J. Robert Oppenheimer, vai trò của ông trong việc phát triển bom nguyên tử và những dằn vặt lương tâm sau đó.",
      genre: "Tiểu sử, Lịch sử, Tâm lý",
      duration: 180,
      releaseDate: "2023-07-21",
      rating: 8.5,
      reviews: [{ user: "Dũng", comment: "Christopher Nolan không bao giờ làm thất vọng.", star: 5 }]
    },
    {
      id: 7,
      title: "Dune: Part Two",
      posterUrl: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      description: "Paul Atreides hợp nhất với Chani và người Fremen trên con đường trả thù những kẻ đã hủy hoại gia đình mình.",
      genre: "Hành động, Phiêu lưu, Viễn tưởng",
      duration: 166,
      releaseDate: "2024-03-01",
      rating: 8.8,
      reviews: [{ user: "Kiên", comment: "Phim sử thi hay nhất năm!", star: 5 }]
    },
    {
      id: 8,
      title: "Spider-Man: No Way Home",
      posterUrl: "https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_poster.jpg",
      description: "Danh tính của Spider-Man bị tiết lộ. Peter nhờ Doctor Strange giúp đỡ nhưng phép thuật bị hỏng, kéo theo những kẻ thù từ vũ trụ khác.",
      genre: "Siêu anh hùng, Hành động",
      duration: 148,
      releaseDate: "2021-12-17",
      rating: 8.2,
      reviews: [{ user: "Long", comment: "3 Nhện cùng xuất hiện, quá phê!", star: 5 }]
    },
    {
      id: 9,
      title: "The Batman",
      posterUrl: "https://upload.wikimedia.org/wikipedia/en/f/ff/The_Batman_%28film%29_poster.jpg",
      description: "Batman thâm nhập vào thế giới ngầm của Gotham khi một tên sát nhân tàn bạo để lại một loạt các manh mối bí ẩn.",
      genre: "Hành động, Trinh thám",
      duration: 176,
      releaseDate: "2022-03-04",
      rating: 7.8,
      reviews: [{ user: "Vân", comment: "Phim tối tăm và chân thực.", star: 4 }]
    },
    {
      id: 10,
      title: "Joker",
      posterUrl: "https://upload.wikimedia.org/wikipedia/en/e/e1/Joker_%282019_film%29_poster.jpg",
      description: "Ở thành phố Gotham, diễn viên hài Arthur Fleck vật lộn với chứng bệnh cười không kiểm soát và sự ghẻ lạnh của xã hội.",
      genre: "Tâm lý, Tội phạm",
      duration: 122,
      releaseDate: "2019-10-04",
      rating: 8.4,
      reviews: [{ user: "Tâm", comment: "Diễn xuất đỉnh cao của Joaquin Phoenix.", star: 5 }]
    },
    {
      id: 11,
      title: "Top Gun: Maverick",
      posterUrl: "https://upload.wikimedia.org/wikipedia/en/1/13/Top_Gun_Maverick_Poster.jpg",
      description: "Sau hơn ba mươi năm phục vụ, Pete 'Maverick' Mitchell trở lại để đào tạo một nhóm phi công Top Gun cho một nhiệm vụ chuyên biệt.",
      genre: "Hành động, Phiêu lưu",
      duration: 130,
      releaseDate: "2022-05-27",
      rating: 8.3,
      reviews: [{ user: "Hoàng", comment: "Cảnh máy bay chiến đấu quá thật.", star: 5 }]
    },
    {
      id: 12,
      title: "Titanic",
      posterUrl: "https://upload.wikimedia.org/wikipedia/en/1/18/Titanic_%281997_film%29_poster.png",
      description: "Một quý tộc 17 tuổi rơi vào lưới tình với một nghệ sĩ nghèo tốt bụng trên con tàu Titanic sang trọng nhưng xấu số.",
      genre: "Lãng mạn, Thảm họa",
      duration: 195,
      releaseDate: "1997-12-19",
      rating: 7.9,
      reviews: [{ user: "Lan", comment: "Kinh điển, xem lại vẫn khóc.", star: 5 }]
    }
  ];

  // Logic tìm phim theo ID
  useEffect(() => {
    // Tìm trong kho dữ liệu xem phim nào có ID khớp với ID trên URL
    const foundMovie = mockMovies.find(m => m.id === parseInt(id));
    
    if (foundMovie) {
      setMovie(foundMovie);
    } else {
      // Nếu ID không tồn tại (ví dụ nhập bừa /movie/999), fallback về phim đầu tiên
      setMovie(mockMovies[0]); 
    }
  }, [id]);

  // Dữ liệu Suất chiếu giả lập
  const showtimes = [
    { id: 101, time: "09:30", room: "Rạp 1", price: 75000 },
    { id: 102, time: "13:15", room: "Rạp 2", price: 85000 },
    { id: 103, time: "19:00", room: "Rạp IMAX", price: 120000 },
    { id: 104, time: "22:30", room: "Rạp 2", price: 85000 },
  ];

  const handleSelectShowtime = (showtimeId) => {
    navigate(`/booking/${showtimeId}`);
  };

  if (!movie) return <div style={{color:'white', padding:'20px'}}>Đang tải thông tin phim...</div>;

  return (
    <div className="movie-detail-container">
      <div className="detail-content">
        <div className="detail-poster">
          {/* Lấy ảnh từ movie đã tìm thấy */}
          <img src={movie.posterUrl} alt={movie.title} />
        </div>
        <div className="detail-info">
          <h1>{movie.title}</h1>
          <p>⭐ <strong>{movie.rating}/10</strong> ({movie.reviews?.length || 0} đánh giá)</p>
          <p>⏳ {movie.duration} phút | 📅 {movie.releaseDate}</p>
          <p className="desc">{movie.description}</p>
          <p style={{marginTop: '10px', color: '#aaa'}}>🎭 Thể loại: {movie.genre}</p>

          <div className="showtime-section">
            <h3>📅 LỊCH CHIẾU HÔM NAY</h3>
            <div className="time-list">
              {showtimes.map((show) => (
                <button 
                  key={show.id} 
                  className="time-btn"
                  onClick={() => handleSelectShowtime(show.id)}
                >
                  <span className="time">{show.time}</span>
                  <span className="room">{show.room}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="review-section">
            <h3>💬 ĐÁNH GIÁ TỪ KHÁN GIẢ</h3>
            {movie.reviews && movie.reviews.map((review, index) => (
              <div key={index} className="review-item">
                <strong>{review.user}</strong> <span>{'⭐'.repeat(review.star)}</span>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;