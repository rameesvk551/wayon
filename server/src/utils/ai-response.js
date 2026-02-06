import { z } from "zod";
import { safeJsonParse } from "./http.js";

const AiIntentSchema = z.object({
  name: z.string(),
  confidence: z.number().min(0).max(1).optional(),
  slots: z.record(z.any()).optional(),
});

const AiResponseSchema = z.object({
  reply: z.string().optional(),
  summary: z.string().optional(),
  recommendations: z.array(z.any()).optional(),
  next_questions: z.array(z.string()).optional(),
  itinerary: z.any().optional(),
  intent: AiIntentSchema.optional(),
  ui: z.object({
    version: z.string().optional(),
    blocks: z.array(z.any()),
  }).optional(),
});

export const parseAiResponse = (value) => {
  const parsed = typeof value === "string" ? safeJsonParse(value) : value;
  if (!parsed) {
    return { ok: false, error: "AI response was not valid JSON." };
  }

  const result = AiResponseSchema.safeParse(parsed);
  if (!result.success) {
    return {
      ok: false,
      error: "AI response did not match schema.",
      issues: result.error?.issues ?? [],
    };
  }

  return { ok: true, data: result.data };
};
