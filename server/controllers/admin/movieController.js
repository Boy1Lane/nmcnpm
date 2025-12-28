const Movie = require('../../models/Movie');
const cloudinary = require('../../config/cloudinary');

const uploadBufferToCloudinary = (buffer, options = {}) => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    {
      folder: options.folder || 'movies',
      resource_type: 'image'
    },
    (error, result) => {
      if (error) return reject(error);
      resolve(result);
    }
  );

  stream.end(buffer);
});

// /POST /api/movies -> createMovie
exports.createMovie = async (req, res) => {
  try {
    const { title, description, director, actor, genre, duration, releaseDate, posterUrl, trailerUrl } = req.body;

    if (!title || !duration || !releaseDate) {
      return res.status(400).json({ message: 'Missing value (title, duration, releaseDate)!' });
    }

    let resolvedPosterUrl = posterUrl;
    if (req.file && req.file.buffer) {
      const uploaded = await uploadBufferToCloudinary(req.file.buffer, { folder: 'movies/posters' });
      resolvedPosterUrl = uploaded.secure_url;
    }

    const newMovie = await Movie.create({
      title,
      description,
      director,
      actor,
      genre,
      duration,
      releaseDate,
      posterUrl: resolvedPosterUrl,
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

// /GET /api/movies -> getAllMovies
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: 'getAllMovies error' });
  }
};

// GET /api/movies/:id -> getAMovie
exports.getAMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: 'getAMovie error' });
  }
};

// PUT /api/movies/:id -> updateMovie
exports.updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, description, director, 
      actor, genre, duration, releaseDate, 
      posterUrl, trailerUrl, status 
    } = req.body;
    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    let resolvedPosterUrl = posterUrl;
    if (req.file && req.file.buffer) {
      const uploaded = await uploadBufferToCloudinary(req.file.buffer, { folder: 'movies/posters' });
      resolvedPosterUrl = uploaded.secure_url;
    }

    await movie.update({
      title,
      description,
      director,
      actor,
      genre,
      duration,
      releaseDate,
      posterUrl: resolvedPosterUrl,
      trailerUrl,
      status
    });
    res.status(200).json({
      message: 'Update movie successfully!',
      data: movie
    });
  } catch (error) {
    res.status(500).json({ message: 'updateMovie error' });
  }
};

// DELETE /api/movies/:id -> deleteMovie
exports.deleteMovie = async (req, res) => {
  console.log("🟡 BE nhận request xoá ID:", req.params.id);
  try {
    const { id } = req.params;
    const movie = await Movie.findByPk(id);
    if (!movie) {
      console.log("❌ Không tìm thấy phim để xoá!");
      return res.status(404).json({ message: 'Movie not found' });
    }
    await movie.destroy();
    res.status(200).json({ message: 'Delete movie successfully!' });
  } catch (error) {
    console.log("❌ Lỗi xoá BE:", error);
    res.status(500).json({ message: 'deleteMovie error' });
  }
};
