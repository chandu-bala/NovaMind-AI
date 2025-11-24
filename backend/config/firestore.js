// backend/config/gemini.js
const { VertexAI } = require("@google-cloud/vertexai");

const projectId = process.env.GCP_PROJECT_ID;
const location = process.env.GCP_REGION || "us-central1";

// ✅ Use the model exactly as shown in Model Garden
const MODEL_ID = "gemini-2.5-flash";

const vertexAI = new VertexAI({
  project: projectId,
  location: location,
});

const generativeModel = vertexAI.getGenerativeModel({
  model: MODEL_ID,
});

console.log("✅ Gemini Model Loaded:", MODEL_ID);

module.exports = {
  generativeModel,
};
