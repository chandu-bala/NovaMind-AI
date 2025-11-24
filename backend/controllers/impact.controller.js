// backend/controllers/impact.controller.js
const { db } = require("../config/firestore");
const { generateText } = require("../services/gemini.service");

async function analyzeImpact(req, res) {
  try {
    const { projectTitle, domain, description } = req.body;

    if (!projectTitle && !description) {
      return res.status(400).json({
        error: "At least projectTitle or description is required.",
      });
    }

    const prompt = `
You are an industry analyst and solutions architect.

Project Title: ${projectTitle || "Not specified"}
Domain: ${domain || "Not specified"}
Description: ${description || "Not specified"}

Analyze and describe:

1. The impact of this project in its domain.
2. Specific industry use cases where it can be applied.
3. How it can leverage Google Cloud (Cloud Run, Firestore, Vertex AI) to scale.
4. Potential business/organizational benefits.
5. Future enhancements and expansion opportunities.

Return the response in sections with headings.
`;

    const impact = await generateText(prompt);

    const docRef = await db.collection("impact_analysis").add({
      projectTitle: projectTitle || null,
      domain: domain || null,
      description: description || null,
      impact,
      createdAt: new Date(),
    });

    return res.json({
      id: docRef.id,
      impact,
    });
  } catch (error) {
    console.error("Error in analyzeImpact:", error);
    return res.status(500).json({ error: "Failed to analyze impact." });
  }
}

async function getImpactHistory(req, res) {
  try {
    const snapshot = await db
      .collection("impact_analysis")
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    const items = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });

    return res.json({ items });
  } catch (error) {
    console.error("Error fetching impact history:", error);
    return res.status(500).json({ error: "Failed to fetch impact history." });
  }
}

module.exports = {
  analyzeImpact,
  getImpactHistory,
};
