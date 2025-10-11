import type { FastifyReply, FastifyRequest } from "fastify";

const OK = 200;

// biome-ignore lint/correctness/noUnusedFunctionParameters: <Need this parameter in function>
export function logout(request: FastifyRequest, reply: FastifyReply) {
  return reply
    .clearCookie("refreshToken", {
      path: "/",
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(OK)
    .send({ message: "Logout successful" });
}
