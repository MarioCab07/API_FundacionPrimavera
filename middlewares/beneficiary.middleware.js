const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { sanitizeName } = require("../utils/general.tools");

const debug = require('debug')('app:ben-middleware');

const storage = multer.diskStorage({
  destination: async function(req, file, cb) {
    try {
      
      cb(null, 'temp/');
    } catch (error) {
      cb(error, null);
    }
  },
  filename: function(req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      cb(null, file.originalname);
    } else {
      cb(null, 'photo' + path.extname(file.originalname));
    }
  }
});

const upload = multer({
  limit: { fileSize: 25 * 1024 * 1024 }, // 25 MB
  storage: storage,
  fileFilter: function(req, file, cb) {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed!'), false);
    }
  }
});

module.exports = upload;
