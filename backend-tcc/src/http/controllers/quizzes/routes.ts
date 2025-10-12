import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../../../middlewares/verify-jwt.ts";
import { answerQuiz } from "./answer-quiz.controller.ts";
import { getAllQuizzes } from "./get-all-quizzes.controller.ts";
import { getQuizzes } from "./get-quizzes.controller.ts";

// biome-ignore lint/suspicious/useAwait: This code need be async but without await
export async function quizzesRoutes(app: FastifyInstance) {
  // Hook para aplicar JWT em todas as rotas de quizzes
  app.addHook("onRequest", verifyJWT);

  app.get("/quizzes", getAllQuizzes);
  app.get("/materials/:materialId/quizzes", getQuizzes);
  app.post("/quizzes/:quizId/answer", answerQuiz);
}
