import express from "express";
import cors from "cors";
import config from "./config.js";
import chatRoutes from "./routes/chat.js";
import healthRoutes from "./routes/health.js";
import whatsappRoutes from "./routes/whatsapp.js";
import createVisaModule from "./modules/visa/index.js";
import createHotelModule from "./modules/hotel/index.js";
import createTourModule from "./modules/tour/index.js";
import createAttractionModule from "./modules/attraction/index.js";
import createRouteOptimizerModule from "./modules/route-optimizer/index.js";
import createTransportationModule from "./modules/transportation/index.js";
import createPdfModule from "./modules/pdf/index.js";
import createBudgetTrackerModule from "./modules/budget-tracker/index.js";
import createPackingAssistantModule from "./modules/packing-assistant/index.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api", healthRoutes);
app.use("/api", chatRoutes);
app.use("/whatsapp", whatsappRoutes);

// ── Module routes ──────────────────────────────────────
app.use("/api/visa", createVisaModule());
app.use("/api/hotels", createHotelModule());
app.use("/api/tours", createTourModule());
app.use("/api/attractions", createAttractionModule());
app.use("/api/route-optimizer", createRouteOptimizerModule());
app.use("/api/transportation", createTransportationModule());
app.use("/api/pdf", createPdfModule());
app.use("/api/budget", createBudgetTrackerModule());
app.use("/api/packing", createPackingAssistantModule());

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
