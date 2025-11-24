// backend/routes/career.routes.js
const express = require("express");
const router = express.Router();
const {
  getCareerGuidance,
  getCareerHistory,
} = require("../controllers/career.controller");

router.post("/guidance", getCareerGuidance);
router.get("/history", getCareerHistory);

module.exports = router;
