import type { FastifyReply, FastifyRequest } from "fastify";
import { GetUsersRankingService } from "../../../services/users/get-users-ranking-service.ts";

/**
 * Controller para buscar ranking de usuários por streak
 *
 * GET /users/ranking/streak
 *
 * Retorna todos os usuários ordenados por dias consecutivos de estudo
 */
export async function getUsersRanking(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const service = new GetUsersRankingService();
    const ranking = await service.execute();

    return reply.status(200).send(ranking);
  } catch (error) {
    console.error("Error fetching users ranking:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}