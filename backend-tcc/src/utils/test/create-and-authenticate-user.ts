import type { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(app: FastifyInstance) {
  const email = `test-${Date.now()}@example.com`;
  const password = "12345678"; // Senha com 8 caracteres (mínimo exigido)

  // Criar usuário de teste
  await request(app.server)
    .post("/users/register")
    .send({
      name: "Test User",
      email,
      password,
    });

  // Fazer login para obter o token
  const loginResponse = await request(app.server)
    .post("/users/login")
    .send({
      email,
      password,
    });

  const { token } = loginResponse.body;

  return {
    token,
  };
}
