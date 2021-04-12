const multer = require("multer");

var storage = multer.diskStorage({
  destination: "public",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

module.exports = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(new Error("I don't have a clue!"), false);
    }
  },
  limits: { fileSize: 1024 * 1024 * 2 },
}).single("movieImage");


