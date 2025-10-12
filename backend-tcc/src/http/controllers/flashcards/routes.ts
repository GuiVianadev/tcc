import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../../../middlewares/verify-jwt.ts";
import { getAllFlashcards } from "./get-all-flashcards.controller.ts";
import { getDueFlashcards } from "./get-due-flashcards.controller.ts";
import { getMaterialFlashcards } from "./get-material-flashcards.controller.ts";
import { reviewFlashcard } from "./review-flashcard.controller.ts";

// biome-ignore lint/suspicious/useAwait: This code need be async but without await
export async function flashcardsRoutes(app: FastifyInstance) {
  // Hook para aplicar JWT em todas as rotas de flashcards
  app.addHook("onRequest", verifyJWT);

  app.get("/flashcards", getAllFlashcards);
  app.get("/flashcards/due", getDueFlashcards);
  app.post("/flashcards/:flashcardId/review", reviewFlashcard);
  app.get("/materials/:materialId/flashcards", getMaterialFlashcards);
}
