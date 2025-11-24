const express = require("express");
const router = express.Router();
const { getStats,listIdeas,listLearningPaths,listCareerPlans } = require("../controllers/dashboard.controller");

router.get("/stats", getStats);
router.get("/ideas", listIdeas);
router.get("/learning", listLearningPaths);
router.get("/careers", listCareerPlans);

module.exports = router;
