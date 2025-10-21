import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { env } from "@/env/index.ts";
import { InvalidCredentialsError } from "../../../services/errors/invalid-credentials-error.ts";
import { makeAutheticateUser } from "../../../services/factories/user/make-authenticate.ts";
import { UserDisabledError } from "@/services/errors/user-desactived-errors.ts";

const OK = 200;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const MIN_PASSWORD = 6;

export async function autheticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateBodySchema = z.object({
    email: z.email(),
    password: z.string().min(MIN_PASSWORD),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAutheticateUser();
    const { user } = await authenticateUseCase.execute({
      email,
      password,
    });

    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      }
    );
    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: "7d",
        },
      }
    );
    return reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "none" : "lax",
        httpOnly: true,
      })
      .status(OK)
      .send({ token });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(UNAUTHORIZED).send({ message: err.message });
    }
    if (err instanceof UserDisabledError) {
      return reply.status(FORBIDDEN).send({ message: err.message });
    }
  }
}
