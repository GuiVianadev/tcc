import type { FastifyReply, FastifyRequest } from "fastify";
import { makeGetUserStatisticsService } from "../../../services/factories/users/make-get-user-statistics.ts";

export async function getUserStatistics(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user.sub;

  const service = makeGetUserStatisticsService();
  const statistics = await service.execute({ userId });

  return reply.status(200).send(statistics);
}