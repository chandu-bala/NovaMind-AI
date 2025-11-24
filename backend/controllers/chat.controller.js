// backend/controllers/chat.controller.js
console.log("✅ chat.controller loaded");
const { db } = require("../config/firestore");
const { generateText } = require("../services/gemini.service");

/* ==============================
   CHAT WITH AI MENTOR
============================== */
async function chatWithMentor(req, res) {
  console.log("🔥 Chat HIT:", req.body);

  try {
    const { message, context, userId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!message) {
      return res.status(400).json({ error: "message is required." });
    }

    const prompt = `
You are NovaMind-AI, an AI mentor for projects, learning, and career growth.

Context: ${context || "No previous context"}

User Message:
"${message}"

Respond clearly, helpfully, and professionally.
`;

    const reply = await generateText(prompt);

    const docRef = await db.collection("chat_sessions").add({
      userId,
      message,
      context: context || null,
      reply,
      createdAt: new Date(),
    });

    await db.collection("interactions").add({
      userId,
      type: "chat",
      createdAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      id: docRef.id,
      reply,
    });

  } catch (error) {
    console.error("🔥 Chat error:", error);
    res.status(500).json({
      error: "Failed to respond to chat",
      details: error.message
    });
  }
}


/* ==============================
   CHAT HISTORY (PER USER)
============================== */
async function getChatHistory(req, res) {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const snapshot = await db.collection("chat_sessions")
      .where("userId", "==", userId)
      .limit(50)
      .get();   // ✅ NO orderBy → NO INDEX REQUIRED

    const chats = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      chats
    });

  } catch (error) {
    console.error("🔥 Fetch chat history error:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
}

module.exports = {
  chatWithMentor,
  getChatHistory
};
