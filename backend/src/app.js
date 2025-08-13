import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import webhookRoutes from "./routes/webhookRoutes.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/webhook", webhookRoutes);

export default app;
