import type { FastifyReply, FastifyRequest } from "fastify";
import { NotFoundError } from "@/services/errors/not-found.error.ts";
import { makeGetUserProfile } from "../../../services/factories/make-get-user-profile.ts";

const OK = 200;
const NOT_FOUND = 404;

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getUserProfile = makeGetUserProfile();
    const { user } = await getUserProfile.execute({
      id: request.user.sub,
    });
    return reply.status(OK).send({
      user: {
        ...user,
        id: undefined,
        password_hashed: undefined,
      },
    });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(NOT_FOUND).send({ message: err.message });
    }
  }
}
