const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    // 5MB
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const isImage = file.mimetype && file.mimetype.startsWith('image/');
    if (!isImage) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  }
});

module.exports = upload;
