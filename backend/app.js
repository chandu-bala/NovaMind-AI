const express = require("express");
const cors = require("cors");
const path = require("path");

const ideaRoutes = require("./routes/idea.routes");
const learningRoutes = require("./routes/learning.routes");
const careerRoutes = require("./routes/career.routes");
const impactRoutes = require("./routes/impact.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Optional: health check for Cloud Run
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "NovaMind-AI backend is running 🚀" });
});

// API routes
app.use("/api/ideas", ideaRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/impact", impactRoutes);
app.use("/api/chat", chatRoutes);

module.exports = app;
