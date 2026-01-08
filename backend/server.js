const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// ===============================
// API ROUTES (ALWAYS FIRST)
// ===============================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// ===============================
// FRONTEND STATIC
// ===============================
app.use(express.static(path.join(__dirname, "../frontend")));

// ===============================
// EXPRESS v5 SAFE FALLBACK
// (NO app.get("*"))
// ===============================
app.use((req, res, next) => {
  // ❗ API calls ko HTML mat bhejo
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "API not found" });
  }

  res.sendFile(
    path.join(__dirname, "../frontend/index.html")
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
