import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../../app.ts";
import { createAndAuthenticateUser } from "../../../utils/test/create-and-authenticate-user.ts";

describe("Quizzes Routes (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /quizzes", () => {
    it("should be able to list user quizzes with pagination", async () => {
      const { token } = await createAndAuthenticateUser(app);

      const response = await request(app.server)
        .get("/quizzes")
        .query({ page: 1, pageSize: 10 })
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty("quizzes");
      expect(Array.isArray(response.body.quizzes)).toBe(true);
    });

    it("should return 401 when not authenticated", async () => {
      await request(app.server)
        .get("/quizzes")
        .query({ page: 1, pageSize: 10 })
        .expect(401);
    });

    it("should return 400 when page is invalid", async () => {
      const { token } = await createAndAuthenticateUser(app);

      await request(app.server)
        .get("/quizzes")
        .query({ page: 0, pageSize: 10 })
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
    });
  });

  describe("GET /materials/:materialId/quizzes", () => {
    it("should return 404 when material does not exist", async () => {
      const { token } = await createAndAuthenticateUser(app);
      const fakeMaterialId = "550e8400-e29b-41d4-a716-446655440000";

      await request(app.server)
        .get(`/materials/${fakeMaterialId}/quizzes`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });

    it("should return 401 when not authenticated", async () => {
      const fakeMaterialId = "550e8400-e29b-41d4-a716-446655440000";

      await request(app.server)
        .get(`/materials/${fakeMaterialId}/quizzes`)
        .expect(401);
    });

    it("should return 400 when materialId is not a valid UUID", async () => {
      const { token } = await createAndAuthenticateUser(app);

      await request(app.server)
        .get("/materials/invalid-uuid/quizzes")
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
    });
  });

  describe("POST /quizzes/:quizId/answer", () => {
    it("should return 404 when quiz does not exist", async () => {
      const { token } = await createAndAuthenticateUser(app);
      const fakeQuizId = "550e8400-e29b-41d4-a716-446655440000";

      await request(app.server)
        .post(`/quizzes/${fakeQuizId}/answer`)
        .set("Authorization", `Bearer ${token}`)
        .send({ selectedAnswer: "a" })
        .expect(404);
    });

    it("should return 401 when not authenticated", async () => {
      const fakeQuizId = "550e8400-e29b-41d4-a716-446655440000";

      await request(app.server)
        .post(`/quizzes/${fakeQuizId}/answer`)
        .send({ selectedAnswer: "a" })
        .expect(401);
    });

    it("should return 400 when quizId is not a valid UUID", async () => {
      const { token } = await createAndAuthenticateUser(app);

      await request(app.server)
        .post("/quizzes/invalid-uuid/answer")
        .set("Authorization", `Bearer ${token}`)
        .send({ selectedAnswer: "a" })
        .expect(400);
    });

    it("should return 400 when selectedAnswer is invalid", async () => {
      const { token } = await createAndAuthenticateUser(app);
      const fakeQuizId = "550e8400-e29b-41d4-a716-446655440000";

      await request(app.server)
        .post(`/quizzes/${fakeQuizId}/answer`)
        .set("Authorization", `Bearer ${token}`)
        .send({ selectedAnswer: "x" })
        .expect(400);
    });

    it("should return 400 when selectedAnswer is missing", async () => {
      const { token } = await createAndAuthenticateUser(app);
      const fakeQuizId = "550e8400-e29b-41d4-a716-446655440000";

      await request(app.server)
        .post(`/quizzes/${fakeQuizId}/answer`)
        .set("Authorization", `Bearer ${token}`)
        .send({})
        .expect(400);
    });
  });
});
