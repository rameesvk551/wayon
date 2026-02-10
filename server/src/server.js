import express from "express";
import cors from "cors";
import config from "./config.js";
import chatRoutes from "./routes/chat.js";
import healthRoutes from "./routes/health.js";
import whatsappRoutes from "./routes/whatsapp.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api", healthRoutes);
app.use("/api", chatRoutes);
app.use("/whatsapp", whatsappRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Server error", err);
  res.status(500).json({ error: "Unexpected server error" });
});

app.listen(config.port, () => {
  console.log(`AI travel backend listening on port ${config.port}`);
});
