// backend/controllers/idea.controller.js
const { db } = require("../config/firestore");
const { generateText } = require("../services/gemini.service");

/* =====================================
   REFINE IDEA WITH INDUSTRY MODE
===================================== */
async function refineIdea(req, res) {
  try {
    const { idea, domain, industry } = req.body;

    if (!idea) {
      return res.status(400).json({ error: "Idea is required." });
    }

    const prompt = `
You are a senior project mentor and software architect.

User's Raw Idea:
"${idea}"

Domain: ${domain || "Not specified"}
Industry Focus: ${industry || "General"}

Task:
Convert this idea into a structured, professional project blueprint.

Include the following sections:

## 1. Project Title
## 2. Problem Statement
## 3. Target Users
## 4. Proposed Solution
## 5. Core Features
- Use bullet points

## 6. Recommended Tech Stack
- Frontend
- Backend
- Database
- AI / ML

## 7. Google Cloud Integration Possibilities
(Cloud Run, Firestore, Vertex AI, Cloud Storage, etc.)

## 8. Industry-Specific Value
Explain how this project benefits the ${industry || "chosen"} industry.

## 9. Expected Outcomes
## 10. Possible Challenges & Risks

Ensure the explanation is clean, professional, and formatted using Markdown.
`;

    const analysis = await generateText(prompt);

    const docRef = await db.collection("ideas").add({
      idea,
      domain: domain || null,
      industry: industry || null,
      analysis,
      createdAt: new Date(),
    });

    // Track interaction for dashboard
    await db.collection("interactions").add({
      type: "idea-refine",
      createdAt: new Date().toISOString(),
    });

    return res.json({
      success: true,
      id: docRef.id,
      idea,
      analysis,
    });

  } catch (error) {
    console.error("Error in refineIdea:", error);
    return res.status(500).json({ error: "Failed to refine idea." });
  }
}


/* =====================================
   GET IDEA HISTORY
===================================== */
async function getIdeas(req, res) {
  try {
    const snapshot = await db
      .collection("ideas")
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    const ideas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.json({ ideas });

  } catch (error) {
    console.error("Error fetching ideas:", error);
    return res.status(500).json({ error: "Failed to fetch ideas." });
  }
}


/* =====================================
   AI IDEA SCORING SYSTEM
===================================== */
async function scoreIdea(req, res) {
  try {
    const { idea, domain, industry } = req.body;

    if (!idea) {
      return res.status(400).json({ error: "Idea is required for scoring." });
    }

    const prompt = `
You are an AI startup evaluator and innovation analyst.

Evaluate the following project idea and provide numeric scores out of 10.

Idea:
${idea}

Domain: ${domain || "Not specified"}
Industry Focus: ${industry || "General"}

Return the following in Markdown format:

## Idea Evaluation Scores

### Innovation Score (0-10)
- Score:
- Justification:

### Feasibility Score (0-10)
- Score:
- Justification:

### Market Potential Score (0-10)
- Score:
- Justification:

Keep the explanation concise but insightful.
`;

    const scores = await generateText(prompt);

    await db.collection("interactions").add({
      type: "idea-score",
      createdAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      scores
    });

  } catch (error) {
    console.error("Error in scoreIdea:", error);
    res.status(500).json({ error: "Idea scoring failed." });
  }
}


module.exports = {
  refineIdea,
  getIdeas,
  scoreIdea,
};
