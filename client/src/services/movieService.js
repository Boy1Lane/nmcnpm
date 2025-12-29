import axios from '../api/axiosInstance';

const movieService = {
  // Lấy tất cả phim
  getAllMovies: async (status) => {
    // status: 'showing' hoặc 'coming_soon'
    const params = status ? { status } : {};
    const response = await axios.get('/movies', { params });
    return response.data;
  },

  // Lấy chi tiết phim (kèm lịch chiếu)
  getMovieById: async (id) => {
    const response = await axios.get(`/movies/${id}`);
    return response.data;
  }
};

export default movieService;