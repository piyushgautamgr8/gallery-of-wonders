const express = require("express");
const {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
} = require("../controllers/collectionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getCollections);
router.get("/:id", getCollectionById);
router.post("/", protect, createCollection);
router.put("/:id", protect, updateCollection);
router.delete("/:id", protect, deleteCollection);

module.exports = router;
