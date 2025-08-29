const multer = require('multer');


const debug = require('debug')('app:ben-middleware');

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Sólo imágenes'), false);
};

module.exports= multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB
  fileFilter
}).single('photo');


