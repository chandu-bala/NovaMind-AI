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

    const result = await generativeModel.generateContent(request);

    // ✅ Correct way to access Gemini 2.5 response
    const response = result?.response;

    if (!response || !response.candidates || response.candidates.length === 0) {
      console.error("Full Gemini response:", JSON.stringify(result, null, 2));
      throw new Error("Gemini returned empty candidates");
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
