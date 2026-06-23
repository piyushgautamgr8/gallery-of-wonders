const Artwork = require("../models/Artwork");
const Collection = require("../models/Collection");
const Comment = require("../models/Comment");

const getDashboardStats = async (req, res) => {
  try {
    const [artworkCount, collectionCount, commentCount, ownedArtworks] = await Promise.all([
      Artwork.countDocuments({ owner: req.user._id }),
      Collection.countDocuments({ owner: req.user._id }),
      Comment.countDocuments({ user: req.user._id }),
      Artwork.find({ owner: req.user._id }).select("likes bookmarks"),
    ]);

    const totalLikes = ownedArtworks.reduce((total, artwork) => total + (artwork.likes?.length || 0), 0);
    const totalBookmarks = ownedArtworks.reduce((total, artwork) => total + (artwork.bookmarks?.length || 0), 0);

    return res.status(200).json({
      stats: {
        artworks: artworkCount,
        collections: collectionCount,
        comments: commentCount,
        likes: totalLikes,
        bookmarks: totalBookmarks,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch dashboard stats", error: error.message });
  }
};

module.exports = { getDashboardStats };
