// console.log("🚨 SERVER.JS EXECUTED");
// require("dotenv").config();
// const express = require("express");
// const path = require("path");
// // const app = express();
// const app = require("./app"); 

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve frontend
// app.use(express.static(path.join(__dirname, "../frontend")));

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/index.html"));
// });

// // ✅ IMPORTANT: Cloud Run Port Binding
// const PORT = process.env.PORT || 8080;

// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`🚀 NovaMind-AI running on port ${PORT}`);
// });


console.log("🚨 SERVER.JS EXECUTED");

require("dotenv").config();

// ✅ ONLY import app.js
const app = require("./app");

// ✅ Cloud Run compatible port
const PORT = process.env.PORT || 8090;

app.listen(PORT, () => {
  console.log(`🚀 NovaMind-AI running on port ${PORT}`);
});
