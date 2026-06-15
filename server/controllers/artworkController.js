const mongoose = require("mongoose");
const Artwork = require("../models/Artwork");

const formatArtwork = (artwork) => {
  const owner = artwork.owner || {};

  return {
    id: artwork._id,
    title: artwork.title,
    artist: owner.username || "",
    category: artwork.category,
    image: artwork.image,
    description: artwork.description,
    tags: artwork.tags,
    owner: owner._id || owner,
    createdAt: artwork.createdAt,
    updatedAt: artwork.updatedAt,
  };
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getArtworks = async (req, res) => {
  try {
    const { search, q, category, page, limit } = req.query;
    const filter = {};
    const searchTerm = search || q;

    if (searchTerm) {
      const regex = new RegExp(escapeRegex(String(searchTerm).trim()), "i");
      filter.$or = [
        { title: regex },
        { description: regex },
        { category: regex },
        { tags: regex },
      ];
    }

    if (category) {
      filter.category = new RegExp(`^${escapeRegex(String(category).trim())}$`, "i");
    }

    const query = Artwork.find(filter)
      .populate("owner", "username")
      .sort({ createdAt: -1 });

    const pageNumber = Math.max(parseInt(page, 10) || 0, 0);
    const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 0, 0), 100);
    const shouldPaginate = pageNumber > 0 || limitNumber > 0;

    if (shouldPaginate) {
      const currentPage = pageNumber || 1;
      const pageSize = limitNumber || 12;
      const [artworks, total] = await Promise.all([
        query.skip((currentPage - 1) * pageSize).limit(pageSize),
        Artwork.countDocuments(filter),
      ]);

      return res.status(200).json({
        artworks: artworks.map(formatArtwork),
        pagination: {
          page: currentPage,
          limit: pageSize,
          total,
          pages: Math.ceil(total / pageSize),
        },
      });
    }

    const artworks = await query;

    return res.status(200).json({ artworks: artworks.map(formatArtwork) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch artworks", error: error.message });
  }
};

const getArtworkById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    const artwork = await Artwork.findById(req.params.id).populate("owner", "username");

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    return res.status(200).json({ artwork: formatArtwork(artwork) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch artwork", error: error.message });
  }
};

const createArtwork = async (req, res) => {
  try {
    const { title, description, category, image, tags } = req.body;

    if (!title || !description || !category || !image) {
      return res.status(400).json({ message: "Title, description, category, and image are required" });
    }

    const artwork = await Artwork.create({
      title,
      description,
      category,
      image,
      tags: Array.isArray(tags) ? tags : [],
      owner: req.user._id,
    });

    await artwork.populate("owner", "username");

    return res.status(201).json({
      message: "Artwork created successfully",
      artwork: formatArtwork(artwork),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create artwork", error: error.message });
  }
};

const updateArtwork = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    if (!artwork.owner.equals(req.user._id)) {
      return res.status(403).json({ message: "You can only update your own artworks" });
    }

    const allowedFields = ["title", "description", "category", "image", "tags"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        artwork[field] = field === "tags" && !Array.isArray(req.body[field]) ? [] : req.body[field];
      }
    });

    await artwork.save();
    await artwork.populate("owner", "username");

    return res.status(200).json({
      message: "Artwork updated successfully",
      artwork: formatArtwork(artwork),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update artwork", error: error.message });
  }
};

const deleteArtwork = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    if (!artwork.owner.equals(req.user._id)) {
      return res.status(403).json({ message: "You can only delete your own artworks" });
    }

    await artwork.deleteOne();

    return res.status(200).json({ message: "Artwork deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete artwork", error: error.message });
  }
};

module.exports = {
  getArtworks,
  getArtworkById,
  createArtwork,
  updateArtwork,
  deleteArtwork,
};
