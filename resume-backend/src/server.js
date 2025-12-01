import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import optimizeRoutes from "./routes/optimizeRoutes.js";
import generatorRoutes from "./routes/generatorRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.get("/", (_, res) => res.send("Resume Backend API ✔️"));

app.use("/api/resume", resumeRoutes);
app.use("/api/optimize", optimizeRoutes);
app.use("/api/generator", generatorRoutes);
app.use(express.static("."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running http://localhost:${PORT}`));
