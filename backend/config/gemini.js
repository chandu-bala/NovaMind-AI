// backend/config/gemini.js
const { VertexAI } = require("@google-cloud/vertexai");

const projectId = process.env.GCP_PROJECT_ID;
const location = process.env.GCP_REGION || "us-central1";

// Model name – adjust if needed (e.g., gemini-1.5-flash-002)
const MODEL_ID = "gemini-1.5-flash-002";

if (!projectId) {
  console.warn("⚠️ GCP_PROJECT_ID is not set in environment variables.");
}

const vertexAI = new VertexAI({ project: projectId, location });

const generativeModel = vertexAI.getGenerativeModel({
  model: MODEL_ID,
  // You can set additional config like generationConfig, safetySettings etc.
});

module.exports = {
  generativeModel,
};
