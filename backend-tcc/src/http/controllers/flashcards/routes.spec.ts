import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../../app.ts";
import { createAndAuthenticateUser } from "../../../utils/test/create-and-authenticate-user.ts";

describe("Flashcards Routes (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /flashcards", () => {
    it("should be able to list user flashcards with pagination", async () => {
      const { token } = await createAndAuthenticateUser(app);

      const response = await request(app.server)
        .get("/flashcards")
        .query({ page: 1, pageSize: 10 })
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty("flashcards");
      expect(Array.isArray(response.body.flashcards)).toBe(true);
    });

    it("should return 401 when not authenticated", async () => {
      await request(app.server)
        .get("/flashcards")
        .query({ page: 1, pageSize: 10 })
        .expect(401);
    });

    it("should return 400 when pageSize exceeds max limit", async () => {
      const { token } = await createAndAuthenticateUser(app);

      await request(app.server)
        .get("/flashcards")
        .query({ page: 1, pageSize: 101 })
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
    });
  });

  describe("GET /flashcards/due", () => {
    it("should be able to list due flashcards for review", async () => {
      const { token } = await createAndAuthenticateUser(app);

      const response = await request(app.server)
        .get("/flashcards/due")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty("flashcards");
      expect(response.body).toHaveProperty("totalDue");
      expect(Array.isArray(response.body.flashcards)).toBe(true);
      expect(typeof response.body.totalDue).toBe("number");
    });

    it("should return 401 when not authenticated", async () => {
      await request(app.server)
        .get("/flashcards/due")
        .expect(401);
    });
  });

  describe("GET /materials/:materialId/flashcards", () => {
    it("should return 404 when material does not exist", async () => {
      const { token } = await createAndAuthenticateUser(app);
      const fakeMaterialId = "550e8400-e29b-41d4-a716-446655440000";

      await request(app.server)
        .get(`/materials/${fakeMaterialId}/flashcards`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });

    it("should return 401 when not authenticated", async () => {
      const fakeMaterialId = "550e8400-e29b-41d4-a716-446655440000";

      await request(app.server)
        .get(`/materials/${fakeMaterialId}/flashcards`)
        .expect(401);
    });

    it("should return 400 when materialId is not a valid UUID", async () => {
      const { token } = await createAndAuthenticateUser(app);

      await request(app.server)
        .get("/materials/invalid-uuid/flashcards")
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
    });
  });

  describe("POST /flashcards/:flashcardId/review", () => {
    it("should return 404 when flashcard does not exist", async () => {
      const { token } = await createAndAuthenticateUser(app);
      const fakeFlashcardId = "550e8400-e29b-41d4-a716-446655440000";

      await request(app.server)
        .post(`/flashcards/${fakeFlashcardId}/review`)
        .set("Authorization", `Bearer ${token}`)
        .send({ difficulty: "good" })
        .expect(404);
    });

    it("should return 401 when not authenticated", async () => {
      const fakeFlashcardId = "550e8400-e29b-41d4-a716-446655440000";

      await request(app.server)
        .post(`/flashcards/${fakeFlashcardId}/review`)
        .send({ difficulty: "good" })
        .expect(401);
    });

    it("should return 400 when flashcardId is not a valid UUID", async () => {
      const { token } = await createAndAuthenticateUser(app);

      await request(app.server)
        .post("/flashcards/invalid-uuid/review")
        .set("Authorization", `Bearer ${token}`)
        .send({ difficulty: "good" })
        .expect(400);
    });

    it("should return 400 when difficulty is invalid", async () => {
      const { token } = await createAndAuthenticateUser(app);
      const fakeFlashcardId = "550e8400-e29b-41d4-a716-446655440000";

      await request(app.server)
        .post(`/flashcards/${fakeFlashcardId}/review`)
        .set("Authorization", `Bearer ${token}`)
        .send({ difficulty: "invalid" })
        .expect(400);
    });

    it("should return 400 when difficulty is missing", async () => {
      const { token } = await createAndAuthenticateUser(app);
      const fakeFlashcardId = "550e8400-e29b-41d4-a716-446655440000";

      await request(app.server)
        .post(`/flashcards/${fakeFlashcardId}/review`)
        .set("Authorization", `Bearer ${token}`)
        .send({})
        .expect(400);
    });

    it("should accept valid difficulty values", async () => {
      const { token } = await createAndAuthenticateUser(app);
      const fakeFlashcardId = "550e8400-e29b-41d4-a716-446655440000";

      const validDifficulties = ["again", "hard", "good", "easy"];

      for (const difficulty of validDifficulties) {
        // Como o flashcard não existe, deve retornar 404 ao invés de 400
        // Isso prova que a validação passou
        await request(app.server)
          .post(`/flashcards/${fakeFlashcardId}/review`)
          .set("Authorization", `Bearer ${token}`)
          .send({ difficulty })
          .expect(404);
      }
    });
  });
});
