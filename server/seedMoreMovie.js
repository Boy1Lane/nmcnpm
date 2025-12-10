const movies = [
  {
    title: "Inception",
    description: "A thief who steals corporate secrets through dream-sharing tech.",
    director: "Christopher Nolan",
    duration: 148,
    genre: "Sci-Fi",
    releaseDate: "2010-07-16",
    posterUrl: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg"
  },
  {
    title: "Pulp Fiction",
    description: "Crime and redemption in multiple intersecting stories.",
    director: "Quentin Tarantino",
    duration: 154,
    genre: "Crime",
    releaseDate: "1994-10-14",
    posterUrl: "https://image.tmdb.org/t/p/w500/dM2w364MScsjFf8pfMbaWUcWrR.jpg"
  },
  {
    title: "Spirited Away",
    description: "A girl enters a world of gods, witches and spirits.",
    director: "Hayao Miyazaki",
    duration: 125,
    genre: "Animation",
    releaseDate: "2001-07-20",
    posterUrl: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg"
  }
];

async function addMovies() {
  console.log("🎥 Start adding test movies");

  for (const movie of movies) {
    try {
      const res = await fetch("http://localhost:5000/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie)
      });

      console.log("Added:", movie.title);
    } catch (error) {
      console.error("❌ Error:", movie.title, error);
    }
  }

  console.log("🎞️ Movie seeding done!");
}

addMovies();
