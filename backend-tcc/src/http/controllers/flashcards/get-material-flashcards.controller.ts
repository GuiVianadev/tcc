import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeGetMaterialFlashcardsService } from "../../../services/factories/flashcards/make-get-material-flashcards.ts";
import { NotFoundError } from "../../../services/errors/not-found.error.ts";
import { UnauthorizedError } from "../../../services/errors/unauthorized-error.ts";

const OK = 200;
const BAD_REQUEST = 400;
const FORBIDDEN = 403;
const NOT_FOUND = 404;

const getMaterialFlashcardsParamsSchema = z.object({
  materialId: z.string().uuid(),
});

export async function getMaterialFlashcards(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { materialId } = getMaterialFlashcardsParamsSchema.parse(request.params);

    const getMaterialFlashcardsService = makeGetMaterialFlashcardsService();

    const flashcards = await getMaterialFlashcardsService.execute({
      userId: request.user.sub,
      materialId,
    });

    return reply.status(OK).send({ flashcards });
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
