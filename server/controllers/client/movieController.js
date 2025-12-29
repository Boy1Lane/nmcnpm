const { Movie, Showtime, Cinema, Room } = require('../../models');
const { Op } = require('sequelize');

const movieController = {
  // 1. Lấy danh sách phim (Phân loại: đang chiếu / sắp chiếu)
  getMovies: async (req, res) => {
    try {
      const { status } = req.query; // ?status=showing hoặc ?status=coming_soon
      
      const whereCondition = {};
      if (status) {
        whereCondition.status = status;
      }

      const movies = await Movie.findAll({
        where: whereCondition,
        order: [['releaseDate', 'DESC']] // Phim mới nhất lên đầu
      });

      res.status(200).json(movies);
    } catch (error) {
      console.error("Lỗi lấy danh sách phim:", error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // 2. Lấy chi tiết phim kèm Lịch chiếu (Showtimes)
  getMovieDetail: async (req, res) => {
    try {
      const { id } = req.params;
      
      const movie = await Movie.findByPk(id, {
        include: [{
          model: Showtime,
          // Chỉ lấy lịch chiếu tương lai (chưa chiếu)
          where: {
            startTime: { [Op.gt]: new Date() } 
          },
          required: false, // Nếu phim không có lịch chiếu vẫn trả về thông tin phim
          include: [
            { 
              model: Room,
              include: [{ model: Cinema }] // Kèm thông tin Rạp để hiển thị
            }
          ],
          order: [['startTime', 'ASC']]
        }]
      });

      if (!movie) {
        return res.status(404).json({ message: 'Không tìm thấy phim' });
      }

      res.status(200).json(movie);
    } catch (error) {
      console.error("Lỗi lấy chi tiết phim:", error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  }
};

module.exports = movieController;