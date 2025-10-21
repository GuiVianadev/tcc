import type { FastifyReply, FastifyRequest } from "fastify";

const OK = 200;

// biome-ignore lint/correctness/noUnusedFunctionParameters: <Need this parameter in function>
export function logout(request: FastifyRequest, reply: FastifyReply) {
  return reply
    .clearCookie("refreshToken", {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
    })
    .status(OK)
    .send({ message: "Logout successful" });
}
