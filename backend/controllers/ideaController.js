// backend/controllers/idea.controller.js
const { db } = require("../config/firestore");
const { generateText } = require("../services/gemini.service");

async function refineIdea(req, res) {
  try {
    const { idea, domain } = req.body;

    if (!idea) {
      return res.status(400).json({ error: "Idea is required." });
    }

    const prompt = `
You are a senior project mentor and architect.

User's raw idea:
"${idea}"

Domain (if provided): ${domain || "Not specified"}

Task:
Refine this idea into a structured software project blueprint with the following sections:

1. Project Title
2. Problem Statement
3. Target Users
4. Proposed Solution
5. Core Features (bullet list)
6. Tech Stack Suggestion (frontend, backend, DB, AI)
7. Possible Integrations with Google Cloud (Cloud Run, Firestore, Vertex AI, etc.)
8. Expected Outcomes
9. Possible Challenges and Risks

Return the answer in a clean, readable format.
`;

    const analysis = await generateText(prompt);

    const docRef = await db.collection("ideas").add({
      idea,
      domain: domain || null,
      analysis,
      createdAt: new Date(),
    });

    return res.json({
      id: docRef.id,
      idea,
      analysis,
    });
  } catch (error) {
    console.error("Error in refineIdea:", error);
    return res.status(500).json({ error: "Failed to refine idea." });
  }
}

async function getIdeas(req, res) {
  try {
    const snapshot = await db
      .collection("ideas")
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    const ideas = [];
    snapshot.forEach((doc) => {
      ideas.push({ id: doc.id, ...doc.data() });
    });

    return res.json({ ideas });
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return res.status(500).json({ error: "Failed to fetch ideas." });
  }
}

module.exports = {
  refineIdea,
  getIdeas,
};
