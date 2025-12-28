import React, { useState } from 'react';
import MovieCard from '../../components/Client/MovieCard';
import './Homepage.css';

const Homepage = () => {
  // Danh sách 12 phim bom tấn với ID và Ảnh chuẩn từ TMDB & Wikipedia
  const [movies] = useState([
    { 
      id: 1, 
      title: "Inception", 
      duration: 148, 
      posterUrl: "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg", 
      releaseDate: "2010-07-16",
      status: "showing" 
    },
    { 
      id: 2, 
      title: "Interstellar", 
      duration: 169, 
      posterUrl: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg", 
      releaseDate: "2014-11-07",
      status: "showing"
    },
    { 
      id: 3, 
      title: "The Dark Knight", 
      duration: 152, 
      posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", 
      releaseDate: "2008-07-18",
      status: "showing"
    },
    { 
      id: 4, 
      title: "Avatar: The Way of Water", 
      duration: 192, 
      posterUrl: "https://upload.wikimedia.org/wikipedia/en/5/54/Avatar_The_Way_of_Water_poster.jpg", 
      releaseDate: "2022-12-16",
      status: "showing"
    },
    { 
      id: 5, 
      title: "Avengers: Endgame", 
      duration: 181, 
      posterUrl: "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg", 
      releaseDate: "2019-04-26",
      status: "showing"
    },
    { 
      id: 6, 
      title: "Oppenheimer", 
      duration: 180, 
      posterUrl: "https://upload.wikimedia.org/wikipedia/en/4/4a/Oppenheimer_%28film%29.jpg", 
      releaseDate: "2023-07-21",
      status: "showing"
    },
    {
      id: 7,
      title: "Dune: Part Two",
      duration: 166,
      // ✅ ĐÃ SỬA: Link ảnh mới siêu nét từ TMDB (Server chuyên dụng)
      posterUrl: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      releaseDate: "2024-03-01",
      status: "showing"
    },
    {
      id: 8,
      title: "Spider-Man: No Way Home",
      duration: 148,
      posterUrl: "https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_poster.jpg",
      releaseDate: "2021-12-17",
      status: "showing"
    },
    {
      id: 9,
      title: "The Batman",
      duration: 176,
      posterUrl: "https://upload.wikimedia.org/wikipedia/en/f/ff/The_Batman_%28film%29_poster.jpg",
      releaseDate: "2022-03-04",
      status: "showing"
    },
    {
      id: 10,
      title: "Joker",
      duration: 122,
      posterUrl: "https://upload.wikimedia.org/wikipedia/en/e/e1/Joker_%282019_film%29_poster.jpg",
      releaseDate: "2019-10-04",
      status: "showing"
    },
    {
      id: 11,
      title: "Top Gun: Maverick",
      duration: 130,
      posterUrl: "https://upload.wikimedia.org/wikipedia/en/1/13/Top_Gun_Maverick_Poster.jpg",
      releaseDate: "2022-05-27",
      status: "showing"
    },
    {
      id: 12,
      title: "Titanic",
      duration: 195,
      posterUrl: "https://upload.wikimedia.org/wikipedia/en/1/18/Titanic_%281997_film%29_poster.png",
      releaseDate: "1997-12-19",
      status: "showing"
    }
  ]);

  return (
    <div className="homepage-container">
      <div className="banner">
        <h1>PHIM ĐANG CHIẾU</h1>
      </div>
      
      <div className="movie-list">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Homepage;