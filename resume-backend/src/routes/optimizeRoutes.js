import express from "express";
import multer from "multer";
import { optimizeText, optimizePDF } from "../controllers/optimizerController.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/", optimizeText);
router.post("/pdf", upload.single("resume"), optimizePDF);

export default router;