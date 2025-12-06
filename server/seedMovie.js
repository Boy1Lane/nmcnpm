const axios = require('axios');

const movies = [
  { title: "Inception", description: "A thief who steals corporate secrets through the use of dream-sharing technology.", director: "Christopher Nolan", duration: 148, releaseDate: "2010-07-16", posterUrl: "https://example.com/inception.jpg", genre: "Sci-Fi" },
  { title: "Pulp Fiction", description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.", director: "Quentin Tarantino", duration: 154, releaseDate: "1994-10-14", posterUrl: "https://example.com/pulp_fiction.jpg", genre: "Crime" },
  { title: "Spirited Away", description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.", director: "Hayao Miyazaki", duration: 125, releaseDate: "2001-07-20", posterUrl: "https://example.com/spirited_away.jpg", genre: "Animation" }
];

async function addMultipleTestMovies() {
  console.log("Start adding films");

  for (const movie of movies) {
    try {
      const response = await fetch('http://localhost:5000/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movie)
      });
      const data = await response.json();
      console.log(`Added: ${movie.title}`);
    } catch (error) {
      console.error(`Error when adding ${movie.title}:`, error);
    }
  }
  console.log("addMultipleTestMovies finished");
}

addMultipleTestMovies();