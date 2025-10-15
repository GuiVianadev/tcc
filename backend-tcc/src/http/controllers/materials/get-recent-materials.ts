import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeGetRecentMaterials } from "@/services/factories/materials/make-get-recent-materials.ts";

const OK = 200;
const BAD_REQUEST = 400;

export async function getRecentMaterials(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const getRecentMaterialsService = makeGetRecentMaterials();

    const result = await getRecentMaterialsService.execute({
      userId: request.user.sub,
    });

    return reply.status(OK).send(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(BAD_REQUEST).send({
        message: "Validation error",
        errors: err.issues,
      });
    }
    throw err;
  }
}
