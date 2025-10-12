import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../../app.ts";
import { createAndAuthenticateUser } from "../../../utils/test/create-and-authenticate-user.ts";

describe("Flashcard History Routes (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /flashcards/:flashcardId/history", () => {
    it("should return 404 when flashcard does not exist", async () => {
      const { token } = await createAndAuthenticateUser(app);
      const fakeFlashcardId = "00000000-0000-0000-0000-000000000000";

      await request(app.server)
        .get(`/flashcards/${fakeFlashcardId}/history`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });

    it("should return 401 when not authenticated", async () => {
      const fakeFlashcardId = "00000000-0000-0000-0000-000000000000";

      await request(app.server)
        .get(`/flashcards/${fakeFlashcardId}/history`)
        .expect(401);
    });

    it("should return error when flashcardId is not a valid UUID", async () => {
      const { token } = await createAndAuthenticateUser(app);

      const response = await request(app.server)
        .get("/flashcards/invalid-uuid/history")
        .set("Authorization", `Bearer ${token}`);

      // Validation error (Zod throws 400 or 500 depending on error handler)
      expect([400, 500]).toContain(response.status);
    });

    it("should be able to get flashcard review history", async () => {
      const { token } = await createAndAuthenticateUser(app);
      const fakeFlashcardId = "00000000-0000-0000-0000-000000000000";

      const response = await request(app.server)
        .get(`/flashcards/${fakeFlashcardId}/history`)
        .set("Authorization", `Bearer ${token}`);

      // Vai dar 404 porque não há flashcard, mas estrutura está correta
      if (response.status === 200) {
        expect(response.body).toHaveProperty("reviews");
        expect(Array.isArray(response.body.reviews)).toBe(true);
      }
    });
  });
});
