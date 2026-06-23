const express = require("express");
const { uploadArtworkImage } = require("../controllers/uploadController");
const { protect } = require("../middleware/authMiddleware");
const { handleArtworkUpload } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/artwork", protect, handleArtworkUpload, uploadArtworkImage);

module.exports = router;
