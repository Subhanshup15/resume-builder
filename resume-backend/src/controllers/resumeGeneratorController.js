import PDFDocument from "pdfkit";
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

// Generate resume using ChatGPT AI
export const generateResume = async (req, res) => {
    try {
        initializeClients();

        const formData = req.body;

        if (!formData.personal || !formData.personal.fullName) {
            return res.status(400).json({ error: "Full name is required" });
        }

        // Build resume text from form data
        const resumeText = buildResumeText(formData);

        let optimizedResume;

        // Try OpenAI first, fallback to Gemini
        if (openai) {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert resume writer. Improve resumes for maximum ATS compatibility and recruiter appeal."
                    },
                    {
                        role: "user",
                        content: `Improve this resume for maximum ATS compatibility and recruiter appeal.

Guidelines:
- Use strong action verbs (led, implemented, developed, etc.)
- Include quantifiable metrics where possible
- Keep bullet points concise and impactful
- Maintain professional formatting
- Do NOT invent fake experience
- Preserve all original information

Resume to enhance:
${resumeText}

Return ONLY the enhanced resume text, properly formatted with clear sections.`
                    }
                ],
                temperature: 0.7,
            });

            optimizedResume = response.choices[0].message.content;
        } else if (genAI) {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(`
      You are an expert resume writer. Improve this resume for maximum ATS compatibility and recruiter appeal.
      
      Guidelines:
      - Use strong action verbs (led, implemented, developed, etc.)
      - Include quantifiable metrics where possible
      - Keep bullet points concise and impactful
      - Maintain professional formatting
      - Do NOT invent fake experience
      - Preserve all original information
      
      Resume to enhance:
      ${resumeText}
      
      Return ONLY the enhanced resume text, properly formatted with clear sections.
    `);
            optimizedResume = result.response.text();
        } else {
            return res.status(500).json({ error: "No AI API key configured. Set OPENAI_API_KEY or GEMINI_API_KEY in .env" });
        }

        res.json({
            success: true,
            resume: optimizedResume,
            formData, // Include original form data for reference
        });
    } catch (error) {
        console.error("Generate resume error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Generate resume as PDF
export const generatePDF = async (req, res) => {
    try {
        const { resume, fullName } = req.body;

        if (!resume) {
            return res.status(400).json({ error: "Resume content is required" });
        }

        // Create PDF document
        const doc = new PDFDocument({
            size: "A4",
            margin: 50,
        });

        // Set response headers for PDF download
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="resume-${fullName || "document"}.pdf"`
        );

        // Pipe the PDF to response
        doc.pipe(res);

        // Add content to PDF
        doc.fontSize(14).font("Helvetica-Bold").text(fullName || "Resume", { align: "center" });
        doc.moveDown(0.5);
        doc.fontSize(10).font("Helvetica").text(resume, {
            align: "left",
            width: 495,
        });

        // Finalize PDF
        doc.end();
    } catch (error) {
        console.error("PDF generation error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Helper function to build resume text from form data
function buildResumeText(data) {
    let text = "";

    // Personal Info
    if (data.personal) {
        text += `${data.personal.fullName}\n`;
        if (data.personal.email) text += `Email: ${data.personal.email}\n`;
        if (data.personal.phone) text += `Phone: ${data.personal.phone}\n`;
        if (data.personal.location) text += `Location: ${data.personal.location}\n`;
        if (data.personal.summary) text += `\n${data.personal.summary}\n`;
        text += "\n";
    }

    // Experience
    if (data.experience && data.experience.length > 0) {
        text += "EXPERIENCE\n";
        data.experience.forEach((exp) => {
            if (exp.role || exp.company) {
                text += `${exp.role || "Position"} at ${exp.company || "Company"}\n`;
                if (exp.desc) text += `${exp.desc}\n`;
            }
        });
        text += "\n";
    }

    // Education
    if (data.education && data.education.length > 0) {
        text += "EDUCATION\n";
        data.education.forEach((edu) => {
            if (edu.degree || edu.school) {
                text += `${edu.degree || "Degree"} from ${edu.school || "School"}`;
                if (edu.start || edu.end) text += ` (${edu.start || "Start"} - ${edu.end || "End"})`;
                text += "\n";
                if (edu.desc) text += `${edu.desc}\n`;
            }
        });
        text += "\n";
    }

    // Skills
    if (data.skills) {
        text += `SKILLS\n${data.skills}\n\n`;
    }

    // Certifications
    if (data.certifications) {
        text += `CERTIFICATIONS\n${data.certifications}\n\n`;
    }

    return text;
}
