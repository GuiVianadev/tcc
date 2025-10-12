import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeGetAllQuizzesService } from "../../../services/factories/quizzes/make-get-all-quizzes.ts";

const OK = 200;
const BAD_REQUEST = 400;
const MAX_PAGE_SIZE = 100;
const MIN_PAGE_SIZE = 5;

const getAllQuizzesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(MIN_PAGE_SIZE)
    .max(MAX_PAGE_SIZE)
    .default(10),
});

export async function getAllQuizzes(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { page, pageSize } = getAllQuizzesQuerySchema.parse(request.query);

    const getAllQuizzesService = makeGetAllQuizzesService();

    const quizzes = await getAllQuizzesService.execute({
      userId: request.user.sub,
      page,
      pageSize,
    });

    return reply.status(OK).send({ quizzes });
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
