// backend/controllers/career.controller.js
const { db } = require("../config/firestore");
const { generateText } = require("../services/gemini.service");

async function getCareerGuidance(req, res) {
  try {
    const { education, skills, interests, targetRole } = req.body;

    if (!education && !skills && !interests && !targetRole) {
      return res.status(400).json({
        error:
          "At least one of education, skills, interests, or targetRole is required.",
      });
    }

    const prompt = `
You are a career guidance expert.

User Profile:
- Education: ${education || "Not specified"}
- Skills: ${skills || "Not specified"}
- Interests: ${interests || "Not specified"}
- Target Role: ${targetRole || "Not specified"}

1. Suggest 3-5 suitable career paths or roles.
2. For each suggested path, provide:
   - Role name
   - Why it's a good fit
   - Skills required
   - Suggested upskilling path (high-level)

3. Suggest types of mentors they should look for on LinkedIn (e.g., "Senior Cloud Engineer", "AI Researcher", etc.)
4. Provide 3-5 sample LinkedIn search queries they can use to find relevant mentors.

Return answer in structured format.
`;

    const guidance = await generateText(prompt);

    const docRef = await db.collection("career_guidance").add({
      userId,
      education: education || null,
      skills: skills || null,
      interests: interests || null,
      targetRole: targetRole || null,
      guidance,
      createdAt: new Date(),
    });
    await db.collection("interactions").add({
  type: "career-guidance",
  createdAt: new Date().toISOString(),
});


    return res.json({
      id: docRef.id,
      guidance,
    });
  } catch (error) {
    console.error("Error in getCareerGuidance:", error);
    return res.status(500).json({ error: "Failed to generate career guidance." });
  }
}

async function getCareerHistory(req, res) {
  try {
    const snapshot = await db
      .collection("career_guidance")
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    const items = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });

    return res.json({ items });
  } catch (error) {
    console.error("Error fetching career history:", error);
    return res.status(500).json({ error: "Failed to fetch career history." });
  }
}

module.exports = {
  getCareerGuidance,
  getCareerHistory,
};
