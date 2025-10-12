import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeGetSummariesService } from "../../../services/factories/summaries/make-get-summaries.ts";

const OK = 200;
const BAD_REQUEST = 400;
const MAX_PAGE_SIZE = 100;
const MIN_PAGE_SIZE = 5;

const getSummariesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(MIN_PAGE_SIZE)
    .max(MAX_PAGE_SIZE)
    .default(10),
});

export async function getSummaries(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { page, pageSize } = getSummariesQuerySchema.parse(request.query);

    const getSummariesService = makeGetSummariesService();

    const summaries = await getSummariesService.execute({
      userId: request.user.sub,
      page,
      pageSize,
    });

    return reply.status(OK).send({ summaries });
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
