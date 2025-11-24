// backend/routes/chat.routes.js
const express = require("express");
const router = express.Router();
const {
  chatWithMentor,
  getChatHistory,
} = require("../controllers/chat.controller");

router.post("/", chatWithMentor);
router.get("/history", getChatHistory);

module.exports = router;
