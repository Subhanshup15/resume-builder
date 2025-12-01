import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



// ⭐ TEXT OPTIMIZATION
export const optimizeText = async (req, res) => {
  try {
    const { resume } = req.body;

    if (!resume || !resume.trim()) {
      return res.status(400).json({ error: "Resume text is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`
      Optimize this resume for ATS and recruiters.
      Use strong action verbs, bullet points, measurable achievements.
      Do NOT invent skills or work history.

      Resume:
      ${resume}

      Return optimized resume ONLY.
    `);

    res.json({ success: true, optimized: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ⭐ PDF OPTIMIZATION
export const optimizePDF = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded" });

    const parsed = await pdfParse(req.file.buffer);
    const resumeText = parsed.text || "";

    if (!resumeText.trim()) {
      return res.status(400).json({ error: "Cannot read PDF content" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`
      Improve this resume for hiring managers and ATS.
      Use clear formatting, bullet points and results-focused language.

      Resume:
      ${resumeText}

      Return optimized resume ONLY.
    `);

    const optimized = result.response.text();

    // Generate optimized PDF
    const filename = `optimized_${Date.now()}.pdf`;
    const filepath = path.join(process.cwd(), filename);

    await new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);
      doc.fontSize(12).text(optimized);
      doc.end();

      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    res.json({
      success: true,
      optimized,
      file: `${req.protocol}://${req.get("host")}/${filename}`,
    });
  } catch (error) {
    console.error("PDF optimization error:", error);
    res.status(500).json({ error: error.message });
  }
};
