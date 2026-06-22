const getCloudinaryConfig = () => ({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
});

const isCloudinaryConfigured = () => {
  const config = getCloudinaryConfig();
  return Boolean(config.cloudName && config.apiKey && config.apiSecret);
};

module.exports = {
  getCloudinaryConfig,
  isCloudinaryConfigured,
};
