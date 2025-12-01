import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const optimizeResume = async (req, res) => {
  try {
    const { resume } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
Improve this resume for recruiters and ATS.
Use:
• Strong verbs
• Bullet formatting
• Quantify achievements
• Keep real
• DO NOT invent fake jobs

Resume:
${resume}
`;

    const result = await model.generateContent(prompt);
    res.json({ optimized: result.response.text() });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
