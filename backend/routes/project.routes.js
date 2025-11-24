const express = require("express");
const router = express.Router();
const { generateTimeline,getTimelineHistory  } = require("../controllers/project.controller");

router.post("/timeline", generateTimeline);
router.get("/history", getTimelineHistory);

module.exports = router;
