require("dotenv").config();
const express = require("express");
const path = require("path");
const app = require("./app");

const PORT = process.env.PORT || 8080;

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Start server LAST
app.listen(PORT, () => {
  console.log(`NovaMind-AI backend listening on port ${PORT} 🚀`);
});
