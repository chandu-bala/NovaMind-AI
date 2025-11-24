// backend/config/gemini.js
const { VertexAI } = require("@google-cloud/vertexai");

const projectId = process.env.GCP_PROJECT_ID;
const location = process.env.GCP_REGION || "us-central1";

// ✅ Safest and most compatible Gemini model
const MODEL_ID = "gemini-1.5-flash";

if (!projectId) {
  console.warn("⚠️ GCP_PROJECT_ID is not set in environment variables.");
}

const vertexAI = new VertexAI({
  project: projectId,
  location: location,
});

const generativeModel = vertexAI.getGenerativeModel({
  model: MODEL_ID,
});

module.exports = {
  generativeModel,
};
