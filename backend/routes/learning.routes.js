// backend/routes/learning.routes.js
const express = require("express");
const router = express.Router();
const {
  generateLearningRoadmap,
  getLearningPaths,
} = require("../controllers/learning.controller");

router.post("/roadmap", generateLearningRoadmap);
// router.get("/roadmap", generateLearningRoadmap);

router.get("/history", getLearningPaths);

module.exports = router;
