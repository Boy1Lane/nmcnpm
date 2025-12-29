const multer = require('multer');

const uploadMovieMedia = multer({
  storage: multer.memoryStorage(),
  limits: {
    // 50MB (trailers can be larger than images)
    fileSize: 50 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const type = file.mimetype || '';
    const allowed = type.startsWith('image/') || type.startsWith('video/');
    if (!allowed) {
      return cb(new Error('Only image/video files are allowed'), false);
    }
    cb(null, true);
  }
});

module.exports = uploadMovieMedia;
