// const { generativeModel } = require("../config/gemini");

// async function generateText(prompt) {
//   try {
//     const request = {
//       contents: [
//         {
//           role: "user",
//           parts: [{ text: prompt }],
//         },
//       ],
//     };

//     const result = await generativeModel.generateContent(request);

//     // ✅ Correct way to access Gemini 2.5 response
//     const response = result?.response;

//     if (!response || !response.candidates || response.candidates.length === 0) {
//       console.error("Full Gemini response:", JSON.stringify(result, null, 2));
//       throw new Error("Gemini returned empty candidates");
//     }

//     const text = response.candidates[0].content.parts
//       .map(part => part.text)
//       .join("\n");

//     return text;

//   } catch (error) {
//     console.error("🔥 Gemini generation error:", error.message);
//     throw new Error("Failed to generate response from Gemini");
//   }
// }

// module.exports = { generateText };


const { generativeModel } = require("../config/gemini");

async function generateText(prompt) {
  try {
    console.log("📨 Prompt sent to Gemini:", prompt.substring(0, 200));

    const result = await generativeModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    console.log("✅ FULL GEMINI RAW RESPONSE:", JSON.stringify(result, null, 2));

    const response = result?.response;

    if (!response?.candidates?.length) {
      throw new Error("Gemini returned no candidates");
    }

    const text = response.candidates[0].content.parts
      .map(p => p.text)
      .join("\n");

    return text;

  } catch (error) {
    console.error("🔥 GEMINI REAL ERROR:", error.message);
    throw error; // IMPORTANT: never hide real error
  }
}

module.exports = { generateText };
