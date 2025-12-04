import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

// Lazy-load clients to avoid initialization errors
let openai = null;
let genAI = null;

function initializeClients() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
}

// ⭐ TEXT OPTIMIZATION using ChatGPT or Gemini
export const optimizeText = async (req, res) => {
  try {
    initializeClients();

    const { resume } = req.body;

    if (!resume || !resume.trim()) {
      return res.status(400).json({ error: "Resume text is required" });
    }

    let optimized;

    if (openai) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert resume writer and ATS optimizer."
          },
          {
            role: "user",
            content: `Optimize this resume for ATS and recruiters.
Use strong action verbs, bullet points, measurable achievements.
Do NOT invent skills or work history.

Resume:
${resume}

Return optimized resume ONLY.`
          }
        ],
        temperature: 0.7,
      });

      optimized = response.choices[0].message.content;
    } else if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(`
      Optimize this resume for ATS and recruiters.
      Use strong action verbs, bullet points, measurable achievements.
      Do NOT invent skills or work history.

      Resume:
      ${resume}

      Return optimized resume ONLY.
    `);

      optimized = result.response.text();
    } else {
      // Fallback: simple local formatting
      optimized = resume.split('\n').map(l => l.trim()).filter(Boolean).map(l => `- ${l}`).join('\n');
    }

    res.json({ success: true, optimized });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ⭐ PDF OPTIMIZATION using ChatGPT or Gemini
export const optimizePDF = async (req, res) => {
  try {
    initializeClients();

    if (!req.file) return res.status(400).json({ error: "No PDF uploaded" });

    const parsed = await pdfParse(req.file.buffer);
    const resumeText = parsed.text || "";

    if (!resumeText.trim()) {
      return res.status(400).json({ error: "Cannot read PDF content" });
    }

    let optimized;

    if (openai) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert resume writer and ATS optimizer."
          },
          {
            role: "user",
            content: `Improve this resume for hiring managers and ATS.
Use clear formatting, bullet points and results-focused language.
Do NOT invent experience.

Resume:
${resumeText}

Return optimized resume ONLY.`
          }
        ],
        temperature: 0.7,
      });

      optimized = response.choices[0].message.content;
    } else if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(`
      Improve this resume for hiring managers and ATS.
      Use clear formatting, bullet points and results-focused language.

      Resume:
      ${resumeText}

      Return optimized resume ONLY.
    `);

      optimized = result.response.text();
    } else {
      // Fallback
      optimized = resumeText.split('\n').map(l => l.trim()).filter(Boolean).map(l => `- ${l}`).join('\n');
    }

    res.json({
      success: true,
      optimized,
    });
  } catch (error) {
    console.error("PDF optimization error:", error);
    res.status(500).json({ error: error.message });
  }
};
