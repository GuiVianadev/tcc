import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../../../middlewares/verify-jwt.ts";
import { createMaterial } from "./create-material.ts";
import { deleteMaterial } from "./delete-material.ts";
import { getMaterials } from "./get-materials.ts";
import { getRecentMaterials } from "./get-recent-materials.ts";

// biome-ignore lint/suspicious/useAwait: This code need be async but without await
export async function materialsRoutes(app: FastifyInstance) {
  // Hook para aplicar JWT em todas as rotas de materials
  app.addHook("onRequest", verifyJWT);

  app.post("/materials", createMaterial);
  app.get("/materials", getMaterials);
  app.get("/materials/recents", getRecentMaterials);
  app.delete("/materials/:id", deleteMaterial);
}
