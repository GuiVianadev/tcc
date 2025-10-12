import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UnauthorizedError } from "@/services/errors/unauthorized-error.ts";
import { makeDeleteUser } from "@/services/factories/user/make-delete-user.ts";

const FORBIDDEN = 403;
const NO_CONTENT = 204;
const BAD_REQUEST = 400;

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  const deleteUserBodySchema = z.object({
    targetUserId: z.string(),
  });

  const { targetUserId } = deleteUserBodySchema.parse(request.body);

  try {
    const deleteUseCase = makeDeleteUser();

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
    throw err;
  }

  return reply.status(NO_CONTENT).send();
}
