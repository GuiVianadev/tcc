import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeGetSummaryService } from "../../../services/factories/summaries/make-get-summary.ts";
import { NotFoundError } from "../../../services/errors/not-found.error.ts";
import { UnauthorizedError } from "../../../services/errors/unauthorized-error.ts";

const OK = 200;
const BAD_REQUEST = 400;
const FORBIDDEN = 403;
const NOT_FOUND = 404;

const getSummaryParamsSchema = z.object({
  materialId: z.string().uuid(),
});

export async function getSummary(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { materialId } = getSummaryParamsSchema.parse(request.params);

    const getSummaryService = makeGetSummaryService();

    const summary = await getSummaryService.execute({
      userId: request.user.sub,
      materialId,
    });

    return reply.status(OK).send({ summary });
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
