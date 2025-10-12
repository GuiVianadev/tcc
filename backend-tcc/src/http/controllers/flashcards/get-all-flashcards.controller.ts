import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeGetAllFlashcardsService } from "../../../services/factories/flashcards/make-get-all-flashcards.ts";

const OK = 200;
const BAD_REQUEST = 400;
const MAX_PAGE_SIZE = 100;
const MIN_PAGE_SIZE = 5;

const getAllFlashcardsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(MIN_PAGE_SIZE)
    .max(MAX_PAGE_SIZE)
    .default(10),
});

export async function getAllFlashcards(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { page, pageSize } = getAllFlashcardsQuerySchema.parse(request.query);

    const getAllFlashcardsService = makeGetAllFlashcardsService();

    const flashcards = await getAllFlashcardsService.execute({
      userId: request.user.sub,
      page,
      pageSize,
    });

    return reply.status(OK).send({ flashcards });
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
