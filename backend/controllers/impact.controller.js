// backend/controllers/impact.controller.js
console.log("✅ impact.controller loaded");

const { db } = require("../config/firestore");
const { generateText } = require("../services/gemini.service");

/* =====================================
   IMPACT ANALYSIS
===================================== */
async function analyzeImpact(req, res) {
  console.log("🔥 Impact Analyzer HIT:", req.body);

  try {
    const { projectTitle, domain, description, userId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!projectTitle && !description) {
      return res.status(400).json({
        error: "projectTitle or description is required."
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
      userId,
      projectTitle: projectTitle || null,
      domain: domain || null,
      description: description || null,
      impact,
      createdAt: new Date()
    });

    await db.collection("interactions").add({
      userId,
      type: "impact-analysis",
      createdAt: new Date().toISOString()
    });

    return res.json({
      success: true,
      id: docRef.id,
      impact
    });

  } catch (error) {
    console.error("🔥 Impact Analysis Error:", error);
    return res.status(500).json({
      error: "Failed to analyze impact",
      details: error.message
    });
  }
}


/* =====================================
   IMPACT HISTORY (NO INDEX REQUIRED)
===================================== */
async function getImpactHistory(req, res) {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const snapshot = await db
      .collection("impact_analysis")
      .where("userId", "==", userId)
      .limit(20)
      .get();

    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.json({ items });

  } catch (error) {
    console.error("Error fetching impact history:", error);
    return res.status(500).json({ error: "Failed to fetch impact history." });
  }
}

module.exports = {
  analyzeImpact,
  getImpactHistory
};
