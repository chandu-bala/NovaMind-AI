// backend/app.js
const express = require("express");
const cors = require("cors");
const ideaRoutes = require("./routes/idea.routes");
const learningRoutes = require("./routes/learning.routes");
const careerRoutes = require("./routes/career.routes");
const impactRoutes = require("./routes/impact.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "NovaMind-AI backend is running 🚀",
  });
});

// Routes
app.use("/api/ideas", ideaRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/impact", impactRoutes);
app.use("/api/chat", chatRoutes);

module.exports = app;
