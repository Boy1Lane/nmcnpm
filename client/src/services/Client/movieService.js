import axiosClient from '../axiosClient';

const movieService = {
  // Lấy toàn bộ phim từ Database
  getAllMovies: async () => {
    const response = await axiosClient.get('/movies');
    return response.data;
  },
  // Lấy chi tiết phim theo ID
  getMovieById: async (id) => {
    const response = await axiosClient.get(`/movies/${id}`);
    return response.data;
  }
};
export default movieService;