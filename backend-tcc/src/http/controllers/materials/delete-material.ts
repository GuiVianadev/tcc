import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { NotFoundError } from "../../../services/errors/not-found.error.ts";
import { UnauthorizedError } from "../../../services/errors/unauthorized-error.ts";
import { makeDeleteMaterial } from "../../../services/factories/materials/make-delete-material.ts";

const NO_CONTENT = 204;
const NOT_FOUND = 404;
const FORBIDDEN = 403;
const BAD_REQUEST = 400;

const deleteParamsSchema = z.object({
  id: z.uuid(),
});

export async function deleteMaterial(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = deleteParamsSchema.parse(request.params);

    const deleteMaterialService = makeDeleteMaterial();

    await deleteMaterialService.execute({
      userId: request.user.sub,
      materialId: id,
    });

    return reply.status(NO_CONTENT).send();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(BAD_REQUEST).send({
        message: "Validation error",
        errors: err.issues,
      });
    }

    if (err instanceof NotFoundError) {
      return reply.status(NOT_FOUND).send({
        message: "Material not found",
      });
    }

    if (err instanceof UnauthorizedError) {
      return reply.status(FORBIDDEN).send({
        message: "You are not authorized to delete this material",
      });
    }

    throw err;
  }
}
