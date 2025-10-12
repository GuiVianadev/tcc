import type { FastifyReply, FastifyRequest } from "fastify";
import { makeGetDueFlashcardsService } from "../../../services/factories/flashcards/make-get-due-flashcards.ts";

const OK = 200;

export async function getDueFlashcards(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const getDueFlashcardsService = makeGetDueFlashcardsService();

  const result = await getDueFlashcardsService.execute({
    userId: request.user.sub,
  });

  return reply.status(OK).send(result);
}
