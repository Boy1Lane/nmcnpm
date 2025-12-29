import axiosClient from '../axiosClient';

const movieService = {
    // Lấy danh sách phim (kèm filter theo status: showing/coming_soon)
    getAllMovies: async (status = 'showing') => {
        const response = await axiosClient.get(`/api/movies?status=${status}`);
        return response.data;
    },

    // Lấy chi tiết 1 phim và danh sách suất chiếu của phim đó
    getMovieById: async (id) => {
        const response = await axiosClient.get(`/api/movies/${id}`);
        return response.data;
    }
};

export default movieService;