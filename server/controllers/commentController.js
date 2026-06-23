const mongoose = require("mongoose");
const Artwork = require("../models/Artwork");
const Comment = require("../models/Comment");

const formatComment = (comment) => {
  const user = comment.user || {};

  return {
    id: comment._id,
    artwork: comment.artwork,
    text: comment.text,
    user: user._id || user,
    username: user.username || "",
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
};

const getArtworkComments = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.artworkId)) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    const comments = await Comment.find({ artwork: req.params.artworkId })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    return res.status(200).json({ comments: comments.map(formatComment) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch comments", error: error.message });
  }
};

const createComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.artworkId)) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const artwork = await Artwork.findById(req.params.artworkId);

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    const comment = await Comment.create({
      artwork: artwork._id,
      user: req.user._id,
      text,
    });

    await comment.populate("user", "username");

    return res.status(201).json({
      message: "Comment created successfully",
      comment: formatComment(comment),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create comment", error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (!comment.user.equals(req.user._id)) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }

    await comment.deleteOne();

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete comment", error: error.message });
  }
};

module.exports = {
  getArtworkComments,
  createComment,
  deleteComment,
};
