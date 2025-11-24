// backend/controllers/project.controller.js
console.log("✅ project.controller loaded");

const { db } = require("../config/firestore");
const { generateText } = require("../services/gemini.service");

/* ==============================
   PROJECT TIMELINE GENERATOR
============================== */
async function generateTimeline(req, res) {
  console.log("🔥 Timeline HIT:", req.body);

  try {
    const { refinedIdea, userId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!refinedIdea) {
      return res.status(400).json({ error: "refinedIdea is required." });
    }

    const prompt = `
You are a senior software project manager.

Project Description:
${refinedIdea}

Create a 4-week project execution timeline with:

- Week-wise breakdown (Week 1, Week 2, Week 3, Week 4)
- Milestones: Planning, Development, Testing, Deployment
- Clear bullet points for each step

Format the response in professional Markdown.
`;

    const timeline = await generateText(prompt);

    const docRef = await db.collection("project_timelines").add({
      userId,
      refinedIdea,
      timeline,
      createdAt: new Date(),
    });

    await db.collection("interactions").add({
      userId,
      type: "project-timeline",
      createdAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      id: docRef.id,
      timeline,
    });

  } catch (error) {
    console.error("🔥 Timeline Error:", error);
    res.status(500).json({
      error: "Timeline generation failed",
      details: error.message
    });
  }
}
async function getTimelineHistory(req, res) {
  try {
    const userId = req.query.userId;

    const snapshot = await db.collection("project_timelines")
      .where("userId", "==", userId)
      .limit(20)
      .get();

    const timelines = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ success: true, timelines });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch timelines" });
  }
}



module.exports = {
  generateTimeline,getTimelineHistory
};
