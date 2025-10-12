import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { NotFoundError } from "../../../services/errors/not-found.error.ts";
import { UnauthorizedError } from "../../../services/errors/unauthorized-error.ts";
import { makeAnswerQuizService } from "../../../services/factories/quizzes/make-answer-quiz.ts";

const OK = 200;
const BAD_REQUEST = 400;
const FORBIDDEN = 403;
const NOT_FOUND = 404;

const answerQuizParamsSchema = z.object({
  quizId: z.uuid(),
});

const answerQuizBodySchema = z.object({
  selectedAnswer: z.enum(["a", "b", "c", "d"]),
});

export async function answerQuiz(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { quizId } = answerQuizParamsSchema.parse(request.params);
    const { selectedAnswer } = answerQuizBodySchema.parse(request.body);

    const answerQuizService = makeAnswerQuizService();

    const result = await answerQuizService.execute({
      userId: request.user.sub,
      quizId,
      selectedAnswer,
    });

    return reply.status(OK).send(result);
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

    if (err instanceof UnauthorizedError) {
      return reply.status(FORBIDDEN).send({
        message: err.message,
      });
    }

    throw err;
  }
}
