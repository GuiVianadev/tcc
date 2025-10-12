import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeReviewFlashcardService } from "../../../services/factories/flashcards/make-review-flashcard.ts";
import { NotFoundError } from "../../../services/errors/not-found.error.ts";
import { UnauthorizedError } from "../../../services/errors/unauthorized-error.ts";

const OK = 200;
const BAD_REQUEST = 400;
const FORBIDDEN = 403;
const NOT_FOUND = 404;

const reviewFlashcardParamsSchema = z.object({
  flashcardId: z.string().uuid(),
});

const reviewFlashcardBodySchema = z.object({
  difficulty: z.enum(["again", "hard", "good", "easy"]),
});

export async function reviewFlashcard(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { flashcardId } = reviewFlashcardParamsSchema.parse(request.params);
    const { difficulty } = reviewFlashcardBodySchema.parse(request.body);

    const reviewFlashcardService = makeReviewFlashcardService();

    const result = await reviewFlashcardService.execute({
      userId: request.user.sub,
      flashcardId,
      difficulty,
    });

    return reply.status(OK).send(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(BAD_REQUEST).send({
        message: "Validation error",
        errors: err.issues,
      });
    }

    if (err instanceof NotFoundError) {
      return reply.status(NOT_FOUND).send({
        message: err.message,
      });
    }

    if (err instanceof UnauthorizedError) {
      return reply.status(FORBIDDEN).send({
        message: err.message,
      });
    }

    throw err;
  }
}
