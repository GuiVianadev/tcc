// get-users.controller.ts

import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UnauthorizedError } from "../../../services/errors/unauthorized-error.ts";
import { makeGetUsers } from "../../../services/factories/user/make-get-users.ts";

const OK = 200;
const UNAUTHORIZED = 403;
const BAD_REQUEST = 400;
const MAX_PAGE = 100;
const MIN_PAGE = 5;

const getUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(MIN_PAGE).max(MAX_PAGE).default(10),
});

export async function getUsers(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Valida query params
    const { page, pageSize } = getUsersQuerySchema.parse(request.query);

    const getUsersService = makeGetUsers();

    const result = await getUsersService.execute({
      requestingUserId: request.user.sub,
      page,
      pageSize,
    });

    return reply.status(OK).send(result);
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return reply.status(UNAUTHORIZED).send({ message: err.message });
    }

    if (err instanceof z.ZodError) {
      return reply.status(BAD_REQUEST).send({
        message: "Parâmetros inválidos",
        errors: err.issues,
      });
    }

    throw err; // Fastify error handler pega
  }
}
