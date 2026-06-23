const express = require("express");
const {
  getArtworkComments,
  createComment,
  deleteComment,
} = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/artwork/:artworkId", getArtworkComments);
router.post("/artwork/:artworkId", protect, createComment);
router.delete("/:id", protect, deleteComment);

module.exports = router;
