const express = require("express");
const {
  getArtworks,
  getArtworkById,
  getRelatedArtworks,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  toggleLikeArtwork,
  toggleBookmarkArtwork,
} = require("../controllers/artworkController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getArtworks);
router.get("/related/:id", getRelatedArtworks);
router.get("/:id", getArtworkById);
router.post("/", protect, createArtwork);
router.put("/:id", protect, updateArtwork);
router.delete("/:id", protect, deleteArtwork);
router.post("/:id/like", protect, toggleLikeArtwork);
router.post("/:id/bookmark", protect, toggleBookmarkArtwork);

module.exports = router;
