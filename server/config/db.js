const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn("MONGODB_URI or MONGO_URI is missing. Server started without a database connection.");
    return null;
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`MongoDB connection skipped: ${error.message}`);
    return null;
  }
};

module.exports = connectDB;
