import express from "express";
import { generateResume, generatePDF } from "../controllers/resumeGeneratorController.js";

const router = express.Router();

// Generate resume using Gemini
router.post("/generate", generateResume);

// Generate PDF
router.post("/pdf", generatePDF);

export default router;
