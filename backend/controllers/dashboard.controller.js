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
async function listIdeas(req, res) {
  try {
    const snapshot = await db.collection("ideas").orderBy("createdAt", "desc").get();
    const ideas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, ideas });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch ideas" });
  }
}

async function listLearningPaths(req, res) {
  try {
    const snapshot = await db.collection("learning_paths").orderBy("createdAt", "desc").get();
    const paths = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, paths });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch learning paths" });
  }
}

async function listCareerPlans(req, res) {
  try {
    const snapshot = await db.collection("career_guidance").orderBy("createdAt", "desc").get();
    const careers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, careers });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch careers" });
  }
}

module.exports = { 
  getStats, 
  listIdeas, 
  listLearningPaths, 
  listCareerPlans 
};
