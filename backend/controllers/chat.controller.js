// backend/controllers/chat.controller.js
const { db } = require("../config/firestore");
const { generateText } = require("../services/gemini.service");

async function chatWithMentor(req, res) {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message is required." });
    }

    const prompt = `
You are NovaMind-AI, an AI mentor for projects, learning, and career growth.

Context (optional): ${context || "No previous context."}

User message:
"${message}"

Respond in a friendly, concise, and helpful way, guiding the user about projects, learning paths, or career questions.
`;

    const reply = await generateText(prompt);

    const docRef = await db.collection("chat_sessions").add({
      message,
      context: context || null,
      reply,
      createdAt: new Date(),
    });

    return res.json({
      id: docRef.id,
      reply,
    });
  } catch (error) {
    console.error("Error in chatWithMentor:", error);
    return res.status(500).json({ error: "Failed to respond to chat." });
  }
}

async function getChatHistory(req, res) {
  try {
    const snapshot = await db
      .collection("chat_sessions")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const chats = [];
    snapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() });
    });

    return res.json({ chats });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return res.status(500).json({ error: "Failed to fetch chat history." });
  }
}

module.exports = {
  chatWithMentor,
  getChatHistory,
};
