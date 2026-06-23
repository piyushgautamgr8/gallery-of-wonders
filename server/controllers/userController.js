const User = require("../models/User");

const formatUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  profileImage: user.profileImage,
  bio: user.bio,
  bookmarks: user.bookmarks || [],
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const updateProfile = async (req, res) => {
  try {
    const { username, bio, profileImage } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username !== undefined) {
      user.username = username;
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: formatUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

module.exports = { updateProfile };
