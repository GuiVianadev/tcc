import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeGetFlashcardHistoryService } from "../../../services/factories/flashcards/make-get-flashcard-history.ts";
import { NotFoundError } from "../../../services/errors/not-found.error.ts";
import { UnauthorizedError } from "../../../services/errors/unauthorized-error.ts";

const paramsSchema = z.object({
  flashcardId: z.string().uuid(),
});

export async function getFlashcardHistory(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { flashcardId } = paramsSchema.parse(request.params);
  const userId = request.user.sub;

  try {
    const service = makeGetFlashcardHistoryService();
    const { reviews } = await service.execute({ userId, flashcardId });

    return reply.status(200).send({ reviews });
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