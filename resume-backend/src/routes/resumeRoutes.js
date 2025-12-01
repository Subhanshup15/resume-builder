import express from "express";
import { saveResume, getResume, updateResume } from "../controllers/resumeController.js";

const router = express.Router();
router.post("/", saveResume);
router.get("/:userId", getResume);
router.put("/:userId", updateResume);

export default router;
