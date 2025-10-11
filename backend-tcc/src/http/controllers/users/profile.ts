import type { FastifyReply, FastifyRequest } from "fastify";
import { makeGetUserProfile } from "../../../services/factories/make-get-user-profile.ts";

const OK = 200;

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify();

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
}
