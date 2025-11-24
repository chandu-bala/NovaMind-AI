const { VertexAI } = require("@google-cloud/vertexai");
const path = require("path");

process.env.GOOGLE_APPLICATION_CREDENTIALS =
  path.join(__dirname, "../service-account.json");

const projectId = process.env.GCP_PROJECT_ID;
const location = process.env.GCP_REGION || "us-central1";

const MODEL_ID = "gemini-1.0-pro";

const vertexAI = new VertexAI({
  project: projectId,
  location: location,
});

const generativeModel = vertexAI.getGenerativeModel({
  model: MODEL_ID,
});

module.exports = { generativeModel };
