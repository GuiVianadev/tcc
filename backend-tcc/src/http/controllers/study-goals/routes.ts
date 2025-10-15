import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../../../middlewares/verify-jwt.ts";
import { getStudyGoals } from "./get-study-goals.controller.ts";
import { updateStudyGoals } from "./update-study-goals.controller.ts";
import { upsertStudyGoals } from "./upsert-study-goals.controller.ts";

// biome-ignore lint/suspicious/useAwait: <This function need be async without await>
export async function studyGoalsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  // GET /study-goals - Buscar metas do usuário
  app.get("/study-goals", getStudyGoals);

  // POST /study-goals - Criar ou atualizar metas
  app.post("/study-goals", upsertStudyGoals);

  // PATCH /study-goals - Atualizar metas existentes
  app.patch("/study-goals", updateStudyGoals);
}
