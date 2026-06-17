const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/connectDB");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const userRoutes = require("./routes/userRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/user", userRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Book A Doctor API Running");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "MulterError") {
    return res.status(400).send({
      message: err.message,
      success: false,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).send({
      message: "Invalid token",
      success: false,
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).send({
      message: "Token expired",
      success: false,
    });
  }

  res.status(500).send({
    message: "Internal server error",
    success: false,
  });
});

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {});