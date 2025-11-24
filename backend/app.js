// console.log("✅ App.js loaded and initializing configs...");

// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const path = require("path");

// // INIT SERVICES
// require("./config/firestore");
// require("./config/gemini");

// const ideaRoutes = require("./routes/idea.routes");
// const learningRoutes = require("./routes/learning.routes");
// const careerRoutes = require("./routes/career.routes");
// const impactRoutes = require("./routes/impact.routes");
// const chatRoutes = require("./routes/chat.routes");
// const projectRoutes = require("./routes/project.routes");
// const dashboardRoutes = require("./routes/dashboard.routes");
// const authRoutes = require("./routes/auth.routes");

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ✅ GLOBAL LOGGER
// app.use((req, res, next) => {
//   console.log("➡️ REQUEST:", req.method, req.originalUrl);
//   next();
// });

// // ✅ TEST ROUTES
// app.post("/ping", (req, res) => {
//   console.log("✅ PING HIT");
//   res.json({ working: true });
// });

// app.get("/health", (req, res) => {
//   res.json({ status: "ok", message: "NovaMind-AI backend is running 🚀" });
// });

// // ✅ API ROUTES (IMPORTANT: BEFORE STATIC)
// app.use("/api/auth", authRoutes);
// app.use("/api/ideas", ideaRoutes);
// app.use("/api/learning", learningRoutes);
// app.use("/api/career", careerRoutes);
// app.use("/api/impact", impactRoutes);
// app.use("/api/chat", chatRoutes);
// app.use("/api/project", projectRoutes);
// app.use("/api/dashboard", dashboardRoutes);

// // ❗ STATIC FRONTEND SHOULD BE LAST
// app.use(express.static(path.join(__dirname, "../frontend")));

// module.exports = app;


console.log("✅ App.js loaded and initializing configs...");

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

require("./config/firestore");
require("./config/gemini");


const ideaRoutes = require("./routes/idea.routes");
const authRoutes = require("./routes/auth.routes");

// const ideaRoutes = require("./routes/idea.routes");
const learningRoutes = require("./routes/learning.routes");
const careerRoutes = require("./routes/career.routes");
const impactRoutes = require("./routes/impact.routes");
const chatRoutes = require("./routes/chat.routes");
const projectRoutes = require("./routes/project.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
// const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ TEST ROUTE
app.post("/ping", (req, res) => {
  console.log("✅ PING HIT");
  res.json({ working: true });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "NovaMind-AI backend is running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/impact", impactRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(express.static(path.join(__dirname, "../frontend")));

module.exports = app;
