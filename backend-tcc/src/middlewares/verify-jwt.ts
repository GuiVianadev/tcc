import type { FastifyReply, FastifyRequest } from "fastify";

const UNAUTHORIZED = 401;

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (_err) {
    return reply.status(UNAUTHORIZED).send({ message: "Unauthorized" });
  }
}
