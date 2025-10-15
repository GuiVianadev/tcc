import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { NotFoundError } from "../../../services/errors/not-found.error.ts";
import { makeUpdateStudyGoalsService } from "../../../services/factories/study-goals/make-update-study-goals.ts";

const OK = 200;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;

const updateStudyGoalsBodySchema = z.object({
  area_of_interest: z
    .string()
    .min(1, "Área de interesse é obrigatória")
    .optional(),
  daily_flashcards_goal: z.number().int().min(1).max(200).optional(),
  daily_quizzes_goal: z.number().int().min(1).max(100).optional(),
});

export async function updateStudyGoals(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const body = updateStudyGoalsBodySchema.parse(request.body);

    const hasAtLeastOneField =
      body.area_of_interest ||
      body.daily_flashcards_goal ||
      body.daily_quizzes_goal;

    if (!hasAtLeastOneField) {
      return reply.status(BAD_REQUEST).send({
        message: "At least one field must be provided for update",
      });
    }

    const service = makeUpdateStudyGoalsService();
    const goals = await service.execute({
      userId: request.user.sub,
      ...body,
    });

    return reply.status(OK).send(goals);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(BAD_REQUEST).send({
        message: "Validation error",
        errors: err.issues,
      });
    }

    if (err instanceof NotFoundError) {
      return reply.status(NOT_FOUND).send({
        message: err.message,
      });
    }

    throw err;
  }
}
