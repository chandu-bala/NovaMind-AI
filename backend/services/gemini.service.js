// backend/services/gemini.service.js
const { generativeModel } = require("../config/gemini");

async function generateText(prompt) {
  try {
    const request = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    const response = await generativeModel.generateContent(request);
    const candidates = response?.candidates || [];
    const text =
      candidates[0]?.content?.parts?.map((p) => p.text).join("\n") ||
      "No response generated.";
    return text;
  } catch (error) {
    console.error("Gemini generation error:", error);
    throw new Error("Failed to generate response from Gemini");
  }
}

module.exports = {
  generateText,
};
