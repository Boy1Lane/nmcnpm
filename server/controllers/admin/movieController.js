const Movie = require('../../models/Movie');

exports.createMovie = async (req, res) => {
  try {
    const { title, description, director, actor, genre, duration, releaseDate, posterUrl, trailerUrl } = req.body;

    if (!title || !duration || !releaseDate) {
      return res.status(400).json({ message: 'Missing value (title, duration, releaseDate)!' });
    }

    const newMovie = await Movie.create({
      title,
      description,
      director,
      actor,
      genre,
      duration,
      releaseDate,
      posterUrl,
      trailerUrl,
      status: 'coming_soon'
    });

    res.status(201).json({
      message: 'Add movie successfully!',
      data: newMovie
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'server error', error: error.message });
  }
};

exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: 'getAllMovies error' });
  }
};