const Movie = require('../../models/Movie');

exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: 'getAllMovies error' });
  }
};