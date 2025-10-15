import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeUpsertStudyGoalsService } from "../../../services/factories/study-goals/make-upsert-study-goals.ts";

const OK = 200;
const BAD_REQUEST = 400;

const upsertStudyGoalsBodySchema = z.object({
  area_of_interest: z.string().min(1, "Área de interesse é obrigatória"),
  daily_flashcards_goal: z.number().int().min(1).max(200),
  daily_quizzes_goal: z.number().int().min(1).max(100),
});

export async function upsertStudyGoals(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const body = upsertStudyGoalsBodySchema.parse(request.body);

    const service = makeUpsertStudyGoalsService();
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

    throw err;
  }
}
