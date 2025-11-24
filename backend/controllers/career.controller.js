// backend/controllers/career.controller.js
console.log("✅ career.controller loaded");

const { db } = require("../config/firestore");
const { generateText } = require("../services/gemini.service");

/* =====================================
   CAREER GUIDANCE GENERATION
===================================== */
async function getCareerGuidance(req, res) {
  console.log("🔥 Career Guidance HIT:", req.body);

  try {
    const { education, skills, interests, targetRole, userId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!education && !skills && !interests && !targetRole) {
      return res.status(400).json({
        error: "At least one profile field is required"
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
   - Suggested upskilling path

3. Suggest mentor types they should seek on LinkedIn.

4. Provide 3-5 LinkedIn search queries.

Return structured response.
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
      userId,
      type: "career-guidance",
      createdAt: new Date().toISOString(),
    });

    return res.json({
      success: true,
      id: docRef.id,
      guidance,
    });

  } catch (error) {
    console.error("🔥 Career Guidance Error:", error);
    return res.status(500).json({
      error: "Failed to generate career guidance",
      details: error.message
    });
  }
}


/* =====================================
   CAREER HISTORY (NO INDEX REQUIRED)
===================================== */
async function getCareerHistory(req, res) {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const snapshot = await db
      .collection("career_guidance")
      .where("userId", "==", userId)
      .limit(20)
      .get();

    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

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
