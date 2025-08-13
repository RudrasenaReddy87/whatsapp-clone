import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import webhookRoutes from "./routes/webhookRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));
app.use("/webhook", webhookRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.resolve(__dirname, "..", "..", "frontend", "dist");
  app.use(express.static(frontendDistPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

export default app;
