const multer = require("multer");
const AppError = require("../utils/appError");

// Use memory storage to handle buffers instead of saving locally
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Validate that the uploaded file is indeed an image
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new AppError("Only image files are allowed!", 400), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit size to 5MB per image
  },
});

module.exports = upload;
