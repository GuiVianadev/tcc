import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { NotFoundError } from "../../../services/errors/not-found.error.ts";
import { UnauthorizedError } from "../../../services/errors/unauthorized-error.ts";
import { makeGetQuizzesService } from "../../../services/factories/quizzes/make-get-quizzes.ts";

const OK = 200;
const BAD_REQUEST = 400;
const FORBIDDEN = 403;
const NOT_FOUND = 404;

const getQuizzesParamsSchema = z.object({
  materialId: z.string().uuid(),
});

export async function getQuizzes(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { materialId } = getQuizzesParamsSchema.parse(request.params);

    const getQuizzesService = makeGetQuizzesService();

    const quizzes = await getQuizzesService.execute({
      userId: request.user.sub,
      materialId,
    });

    return reply.status(OK).send({ quizzes });
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
