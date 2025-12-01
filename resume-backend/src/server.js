import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import optimizeRoutes from "./routes/optimizeRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => res.send("Resume Backend API ✔️"));

app.use("/api/resume", resumeRoutes);
app.use("/api/optimize", optimizeRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Server running http://localhost:${PORT}`));
