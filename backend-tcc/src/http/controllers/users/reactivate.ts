import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UnauthorizedError } from "@/services/errors/unauthorized-error.ts";
import { makeDeleteUser } from "@/services/factories/user/make-delete-user.ts";
import { makeReactivateUser } from "@/services/factories/user/make-reactivate-user.ts";
import { NotFoundError } from "@/services/errors/not-found.error.ts";
import { ActiveUserError } from "@/services/errors/active-user-errors.ts";

const FORBIDDEN = 403;
const CONFLICT = 409;
const NOT_FOUND = 404;
const NO_CONTENT = 204;
const BAD_REQUEST = 400;

export async function reactivateUser(request: FastifyRequest, reply: FastifyReply) {
  const deleteUserBodySchema = z.object({
    targetUserId: z.string(),
  });

  const { targetUserId } = deleteUserBodySchema.parse(request.body);

  try {
    const deleteUseCase = makeReactivateUser();

    await deleteUseCase.execute({
      userId: request.user.sub,
      targetUserId,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(BAD_REQUEST).send({
        message: "Invalid request data",
        errors: err.issues,
      });
    }

    if (err instanceof UnauthorizedError) {
      return reply.status(FORBIDDEN).send({ message: err.message });
    }
    if (err instanceof NotFoundError) {
      return reply.status(NOT_FOUND).send({ message: err.message });
    }
    if (err instanceof ActiveUserError) {
      return reply.status(CONFLICT).send({ message: err.message });
    }
    throw err;
  }

  return reply.status(NO_CONTENT).send();
}
