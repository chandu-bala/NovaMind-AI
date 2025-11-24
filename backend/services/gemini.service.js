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

    if (!response.candidates || !response.candidates.length) {
      throw new Error("No response returned from Gemini");
    }

    const text = response.candidates[0].content.parts
      .map(part => part.text)
      .join("\n");

    return text;
  } catch (error) {
    console.error("🔥 Gemini generation error:", error.message);
    throw new Error("Failed to generate response from Gemini");
  }
}

module.exports = { generateText };
