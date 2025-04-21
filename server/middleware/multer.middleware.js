const multer = require("multer");

// Configure storage engine for Multer
const storage = multer.diskStorage({
  // Define the destination folder for uploads
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },

  // Define the file naming format: timestamp-originalname
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Export the multer middleware with the configured storage
module.exports = multer({
  storage,
});
