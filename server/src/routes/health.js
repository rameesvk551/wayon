import { Router } from "express";
import config from "../config.js";
import { requestJson } from "../utils/http.js";

const router = Router();

const normalizeModelName = (name) => {
  if (!name) return "";
  return name.includes(":") ? name : `${name}:latest`;
};

const matchesModel = (available, expected) => {
  if (!available) return false;
  const normalizedExpected = normalizeModelName(expected);
  if (available === expected) return true;
  if (available === normalizedExpected) return true;
  return available.startsWith(`${expected}:`);
};

router.get("/health", async (req, res) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    model: config.modelName,
    ollama: {
      reachable: false,
      modelAvailable: false,
      error: null,
    },
  };

  try {
    const response = await requestJson({
      baseUrl: config.ollamaHost,
      path: "/api/tags",
      method: "GET",
      timeoutMs: 2000,
    });

    health.ollama.reachable = response.ok;
    const models = response.json?.models || [];
    const names = models.map((model) => model.name).filter(Boolean);
    health.ollama.modelAvailable = names.some((name) =>
      matchesModel(name, config.modelName)
    );
  } catch (error) {
    health.ollama.error = "Failed to reach Ollama";
  }

  res.json(health);
});

export default router;
