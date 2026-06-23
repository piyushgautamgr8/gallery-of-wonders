const mongoose = require("mongoose");
const Collection = require("../models/Collection");

const formatCollection = (collection) => ({
  id: collection._id,
  title: collection.title,
  description: collection.description,
  owner: collection.owner,
  artworks: collection.artworks || [],
  isPublic: collection.isPublic,
  createdAt: collection.createdAt,
  updatedAt: collection.updatedAt,
});

const getCollections = async (req, res) => {
  try {
    const filter = req.user ? { $or: [{ isPublic: true }, { owner: req.user._id }] } : { isPublic: true };
    const collections = await Collection.find(filter)
      .populate("owner", "username")
      .populate("artworks")
      .sort({ createdAt: -1 });

    return res.status(200).json({ collections: collections.map(formatCollection) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch collections", error: error.message });
  }
};

const getCollectionById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Collection not found" });
    }

    const collection = await Collection.findById(req.params.id)
      .populate("owner", "username")
      .populate("artworks");

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    return res.status(200).json({ collection: formatCollection(collection) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch collection", error: error.message });
  }
};

const createCollection = async (req, res) => {
  try {
    const { title, description, artworks, isPublic } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Collection title is required" });
    }

    const collection = await Collection.create({
      title,
      description,
      artworks: Array.isArray(artworks) ? artworks : [],
      isPublic: isPublic !== undefined ? Boolean(isPublic) : true,
      owner: req.user._id,
    });

    return res.status(201).json({
      message: "Collection created successfully",
      collection: formatCollection(collection),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create collection", error: error.message });
  }
};

const updateCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    if (!collection.owner.equals(req.user._id)) {
      return res.status(403).json({ message: "You can only update your own collections" });
    }

    ["title", "description", "artworks", "isPublic"].forEach((field) => {
      if (req.body[field] !== undefined) {
        collection[field] = field === "artworks" && !Array.isArray(req.body[field]) ? [] : req.body[field];
      }
    });

    await collection.save();

    return res.status(200).json({
      message: "Collection updated successfully",
      collection: formatCollection(collection),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update collection", error: error.message });
  }
};

const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    if (!collection.owner.equals(req.user._id)) {
      return res.status(403).json({ message: "You can only delete your own collections" });
    }

    await collection.deleteOne();

    return res.status(200).json({ message: "Collection deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete collection", error: error.message });
  }
};

module.exports = {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
};
