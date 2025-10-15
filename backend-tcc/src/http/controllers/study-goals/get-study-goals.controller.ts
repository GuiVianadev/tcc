import type { FastifyReply, FastifyRequest } from "fastify";
import { NotFoundError } from "../../../services/errors/not-found.error.ts";
import { makeGetStudyGoalsService } from "../../../services/factories/study-goals/make-get-study-goals.ts";

const OK = 200;
const NOT_FOUND = 404;

export async function getStudyGoals(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const service = makeGetStudyGoalsService();
    const goals = await service.execute({
      userId: request.user.sub,
    });

    return reply.status(OK).send(goals);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(NOT_FOUND).send({
        message: err.message,
      });
    }

    throw err;
  }
}
