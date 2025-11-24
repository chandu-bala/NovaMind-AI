// backend/routes/idea.routes.js
const express = require("express");
const router = express.Router();
const { refineIdea, getIdeas, scoreIdea } = require("../controllers/idea.controller");
router.post("/test", (req, res) => {
  console.log("✅ TEST ROUTE HIT");
  res.json({ success: true, message: "Route working!" });
});

router.post("/refine", refineIdea);
router.get("/history", getIdeas);
router.post("/score", scoreIdea);


module.exports = router;
