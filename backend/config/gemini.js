const { VertexAI } = require("@google-cloud/vertexai");

const vertexAI = new VertexAI({
  project: process.env.GCP_PROJECT_ID,
  location: process.env.GCP_REGION,
});

const generativeModel = vertexAI.preview.getGenerativeModel({
  model: "gemini-2.5-flash",
});

console.log("✅ Gemini Model Loaded: gemini-2.5-flash");

module.exports = { generativeModel };
