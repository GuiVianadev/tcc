import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { UserAlreadyExistsError } from "../../../services/errors/user-already-exists-error.ts";
import { makeRegisterUser } from "../../../services/factories/make-register.ts";

const MIN_PASSWORD = 6;
const MIN_NAME = 3;
const CONFLICT = 409;
const CREATED = 201;

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string().min(MIN_NAME),
    email: z.email(),
    password: z.string().min(MIN_PASSWORD),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const registerUseCase = makeRegisterUser();

    await registerUseCase.execute({
      name,
      email,
      password,
    });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(CONFLICT).send({ message: err.message });
    }
    throw err;
  }

  return reply.status(CREATED).send();
}
