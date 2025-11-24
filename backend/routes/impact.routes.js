// backend/routes/impact.routes.js
const express = require("express");
const router = express.Router();
const {
  analyzeImpact,
  getImpactHistory,
} = require("../controllers/impact.controller");

router.post("/analyze", analyzeImpact);
router.get("/history", getImpactHistory);

module.exports = router;
