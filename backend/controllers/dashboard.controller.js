const { db } = require("../config/firestore");

/* =========================
   DASHBOARD STATS (PER USER)
========================= */
async function getStats(req, res) {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const ideasSnap = await db.collection("ideas")
      .where("userId", "==", userId).get();

    const learningSnap = await db.collection("learning_paths")
      .where("userId", "==", userId).get();

    const careerSnap = await db.collection("career_guidance")
      .where("userId", "==", userId).get();

    const interactionsSnap = await db.collection("interactions")
      .where("userId", "==", userId).get();

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
    console.error("Dashboard error:", err.message);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
}

/* =========================
   LIST IDEAS (PER USER)
========================= */
async function listIdeas(req, res) {
  try {
    const userId = req.query.userId;

    const snapshot = await db.collection("ideas")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const ideas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ success: true, ideas });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch ideas" });
  }
}

/* =========================
   LIST LEARNING PATHS
========================= */
async function listLearningPaths(req, res) {
  try {
    const userId = req.query.userId;

    const snapshot = await db.collection("learning_paths")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const paths = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ success: true, paths });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch learning paths" });
  }
}

/* =========================
   LIST CAREER PLANS
========================= */
async function listCareerPlans(req, res) {
  try {
    const userId = req.query.userId;

    const snapshot = await db.collection("career_guidance")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const careers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

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
