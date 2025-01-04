import multer from 'multer';

const storage = multer.memoryStorage();

const uploads = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only jpg or png supported'), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2, // 2 MB
  },
});

export default uploads;
