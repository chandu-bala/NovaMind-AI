const { db } = require("../config/firestore");

async function getStats(req, res) {
  try {
    const ideasSnap = await db.collection("ideas").get();
    const learningSnap = await db.collection("learning_paths").get();
    const careerSnap = await db.collection("career_guidance").get();
    const interactionsSnap = await db.collection("interactions").get();

    res.json({
      success: true,
      stats: {
        ideas: ideasSnap.size,
        learningPaths: learningSnap.size,
        careerPlans: careerSnap.size,
        totalInteractions: interactionsSnap.size,
      },
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err.message);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
}

module.exports = { getStats };
