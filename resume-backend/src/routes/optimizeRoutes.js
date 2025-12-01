import express from "express";
import { optimizeResume } from "../controllers/optimizerController.js";

const router = express.Router();

router.post("/", optimizeResume);

export default router;
