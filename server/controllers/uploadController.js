const fs = require("fs");
const { isCloudinaryConfigured } = require("../config/cloudinary");

const deleteTempFile = (filePath) => {
  if (typeof filePath === "string") {
    fs.unlink(filePath, () => {});
  }
};

const getImageSource = (req) => {
  if (typeof req.file?.path === "string") {
    return req.file.path;
  }

  if (typeof req.body?.image === "string") {
    return req.body.image;
  }

  return "";
};

const uploadArtworkImage = async (req, res) => {
  if (!isCloudinaryConfigured()) {
    deleteTempFile(req.file?.path);

    return res.status(503).json({
      message: "Cloudinary credentials are not configured",
      requiredEnv: [
        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET",
      ],
    });
  }

  try {
    const image = getImageSource(req);

    if (!image) {
      return res.status(400).json({
        message: "Image file is required",
      });
    }

    const { v2: cloudinary } = require("cloudinary");

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const result = await cloudinary.uploader.upload(image, {
      folder: "gallery-of-wonders/artworks",
      resource_type: "image",
    });

    return res.status(201).json({
      message: "Image uploaded successfully",
      image: result.secure_url,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      imagePublicId: result.public_id,
    });
  } catch (error) {
    if (error.code === "MODULE_NOT_FOUND") {
      return res.status(503).json({
        message: "Cloudinary package is not installed",
      });
    }

    return res.status(500).json({
      message: "Failed to upload image",
      error: error.message,
    });
  } finally {
    deleteTempFile(req.file?.path);
  }
};

module.exports = {
  uploadArtworkImage,
};
