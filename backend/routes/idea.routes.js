// backend/routes/idea.routes.js
const express = require("express");
const router = express.Router();
const { refineIdea, getIdeas } = require("../controllers/idea.controller");

router.post("/refine", refineIdea);
router.get("/history", getIdeas);

module.exports = router;
