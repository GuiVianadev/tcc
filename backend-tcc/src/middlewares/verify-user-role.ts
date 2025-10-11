import type { FastifyReply, FastifyRequest } from "fastify";

const UNAUTHORIZED = 401;

export function verifyUserRole(roleVerify: "admin" | "cliente") {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user;
    if (role !== roleVerify) {
      return await reply.status(UNAUTHORIZED).send({ message: "Unauthorized" });
    }
  };
}
