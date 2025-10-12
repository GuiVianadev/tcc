import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeResetQuizProgressService } from "../../../services/factories/quizzes/make-reset-quiz-progress.ts";
import { NotFoundError } from "../../../services/errors/not-found.error.ts";
import { UnauthorizedError } from "../../../services/errors/unauthorized-error.ts";

const paramsSchema = z.object({
  materialId: z.string().uuid(),
});

export async function resetQuizProgress(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { materialId } = paramsSchema.parse(request.params);
  const userId = request.user.sub;

  try {
    const service = makeResetQuizProgressService();
    await service.execute({ userId, materialId });

    return reply.status(200).send({ message: "Progress reset successfully" });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    if (error instanceof UnauthorizedError) {
      return reply.status(403).send({ message: error.message });
    }

    throw error;
  }
}
