const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const artworkRoutes = require("./routes/artworkRoutes");
const commentRoutes = require("./routes/commentRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const userRoutes = require("./routes/userRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const { requestLogger } = require("./middleware/loggerMiddleware");
const { securityHeaders } = require("./middleware/securityMiddleware");

const app = express();

app.use(securityHeaders);
app.use(requestLogger);
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Gallery of Wonders API",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    database: process.env.MONGO_URI ? "configured" : "missing",
    cloudinary:
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
        ? "configured"
        : "missing",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/artworks", artworkRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/uploads", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
