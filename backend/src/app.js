import express from "express";
import bodyParser from "body-parser";
import webhookRoutes from "./routes/webhookRoutes.js";

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/webhook", webhookRoutes);

export default app;
