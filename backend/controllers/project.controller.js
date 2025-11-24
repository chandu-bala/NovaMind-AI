const { generateText } = require("../services/gemini.service");

async function generateTimeline(req, res) {
  try {
    const { refinedIdea } = req.body;

    if (!refinedIdea) {
      return res.status(400).json({ error: "refinedIdea is required." });
    }

    const prompt = `
You are a senior software project manager.

Based on this project description:

${refinedIdea}

Create a 4-week project execution timeline with:

- Week-wise breakdown (Week 1, Week 2, Week 3, Week 4)
- Milestones under each: Planning, Development, Testing, Deployment
- Short bullet points for each step.

Format the answer in structured Markdown with headings and bullet lists.
`;

    const timeline = await generateText(prompt);

    return res.json({
      success: true,
      timeline,
    });
  } catch (error) {
    console.error("Error in generateTimeline:", error.message);
    return res.status(500).json({ error: "Timeline generation failed." });
  }
}

module.exports = {
  generateTimeline,
};
