// backend/controllers/learning.controller.js
const { db } = require("../config/firestore");
const { generateText } = require("../services/gemini.service");

async function generateLearningRoadmap(req, res) {
  try {
    const { goal, level, hoursPerDay } = req.body;

    if (!goal || !level || !hoursPerDay) {
      return res
        .status(400)
        .json({ error: "goal, level, and hoursPerDay are required." });
    }

    const prompt = `
You are a senior learning coach and technical mentor.

User Goal: ${goal}
Current Level: ${level} (beginner/intermediate/advanced)
Time per day available: ${hoursPerDay} hours

1. Create a detailed 4-week learning roadmap.
2. For each week, provide:
   - Day-wise topics
   - Practice tasks or mini-projects
   - Checkpoints at the end of the week

3. Suggest 3-5 online learning resources (courses, YouTube channels, documentation, or free platforms) that are relevant to "${goal}".
   - Mention platform + short description (e.g., "Coursera - XYZ course", "Google Cloud Skills Boost - XYZ lab").

4. Include a short section on:
   - How this roadmap can help transform the user toward their goal
   - How they can measure their progress

Return the answer in a structured, readable format with headings and bullet points.
`;

    const roadmap = await generateText(prompt);

    const docRef = await db.collection("learning_paths").add({
      goal,
      level,
      hoursPerDay,
      roadmap,
      createdAt: new Date(),
    });
    await db.collection("interactions").add({
  type: "learning-roadmap",
  createdAt: new Date().toISOString(),
});


    return res.json({
      id: docRef.id,
      goal,
      level,
      hoursPerDay,
      roadmap,
    });
  } catch (error) {
    console.error("Error in generateLearningRoadmap:", error);
    return res.status(500).json({ error: "Failed to generate learning roadmap." });
  }
}

async function getLearningPaths(req, res) {
  try {
    const snapshot = await db
      .collection("learning_paths")
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    const paths = [];
    snapshot.forEach((doc) => {
      paths.push({ id: doc.id, ...doc.data() });
    });

    return res.json({ paths });
  } catch (error) {
    console.error("Error fetching learning paths:", error);
    return res.status(500).json({ error: "Failed to fetch learning paths." });
  }
}


module.exports = {
  generateLearningRoadmap,
  getLearningPaths,
};
