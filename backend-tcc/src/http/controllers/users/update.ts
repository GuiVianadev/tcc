import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { NotFoundError } from "@/services/errors/not-found.error.ts";
import { UnauthorizedError } from "@/services/errors/unauthorized-error.ts";
import { makeUpdateUser } from "@/services/factories/user/make-update-user.ts";
import { UserAlreadyExistsError } from "../../../services/errors/user-already-exists-error.ts";

const MIN_PASSWORD = 8;
const MIN_NAME = 3;
const CONFLICT = 409;
const NOT_FOUND = 404;
const FORBIDDEN = 403;
const OK = 200;

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateUserBodySchema = z.object({
    name: z.string().min(MIN_NAME).optional(),
    email: z.email().optional(),
    password: z.string().min(MIN_PASSWORD).optional(),
  });

  const { name, email, password } = updateUserBodySchema.parse(request.body);

  try {
    const updateUseCase = makeUpdateUser();

    await updateUseCase.execute({
      userId: request.user.sub,
      targetUserId: request.user.sub,
      name,
      email,
      password,
    });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(NOT_FOUND).send({ message: err.message });
    }
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(CONFLICT).send({ message: err.message });
    }
    if (err instanceof UnauthorizedError) {
      return reply.status(FORBIDDEN).send({ message: err.message });
    }
    throw err;
  }

  return reply.status(OK).send();
}
