const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDir = path.join(__dirname, "..", "uploads", "tmp");
const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Only jpg, jpeg, png, and webp images are allowed"));
  }

  return cb(null, true);
};

const uploadArtworkFile = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
}).single("image");

const handleArtworkUpload = (req, res, next) => {
  uploadArtworkFile(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Image file must be 10MB or smaller" });
    }

    return res.status(400).json({ message: error.message || "Invalid image upload" });
  });
};

module.exports = { handleArtworkUpload };
