import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../../../middlewares/verify-jwt.ts";
import { getSummaries } from "./get-summaries.controller.ts";
import { getSummary } from "./get-summary.controller.ts";

// biome-ignore lint/suspicious/useAwait: This code need be async but without await
export async function summariesRoutes(app: FastifyInstance) {
  // Hook para aplicar JWT em todas as rotas de summaries
  app.addHook("onRequest", verifyJWT);

  app.get("/summaries", getSummaries);
  app.get("/materials/:materialId/summary", getSummary);
}
