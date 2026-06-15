const express = require("express");
const {
  getArtworks,
  getArtworkById,
  createArtwork,
  updateArtwork,
  deleteArtwork,
} = require("../controllers/artworkController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getArtworks);
router.get("/:id", getArtworkById);
router.post("/", protect, createArtwork);
router.put("/:id", protect, updateArtwork);
router.delete("/:id", protect, deleteArtwork);

module.exports = router;
