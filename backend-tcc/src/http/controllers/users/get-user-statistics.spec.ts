import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../../app.ts";
import { createAndAuthenticateUser } from "../../../utils/test/create-and-authenticate-user.ts";

describe("User Statistics Routes (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /users/me/statistics", () => {
    it("should be able to get user statistics", async () => {
      const { token } = await createAndAuthenticateUser(app);

      const response = await request(app.server)
        .get("/users/me/statistics")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty("quizzes");
      expect(response.body.quizzes).toHaveProperty("total_attempts");
      expect(response.body.quizzes).toHaveProperty("correct_attempts");
      expect(response.body.quizzes).toHaveProperty("accuracy_rate");

      expect(response.body).toHaveProperty("flashcards");
      expect(response.body.flashcards).toHaveProperty("total_reviews");
      expect(response.body.flashcards).toHaveProperty("difficulty_distribution");
      expect(response.body.flashcards.difficulty_distribution).toHaveProperty("again");
      expect(response.body.flashcards.difficulty_distribution).toHaveProperty("hard");
      expect(response.body.flashcards.difficulty_distribution).toHaveProperty("good");
      expect(response.body.flashcards.difficulty_distribution).toHaveProperty("easy");
    });

    it("should return 401 when not authenticated", async () => {
      await request(app.server).get("/users/me/statistics").expect(401);
    });

    it("should return empty statistics for new user", async () => {
      const { token } = await createAndAuthenticateUser(app);

      const response = await request(app.server)
        .get("/users/me/statistics")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.quizzes.total_attempts).toBe(0);
      expect(response.body.quizzes.correct_attempts).toBe(0);
      expect(response.body.quizzes.accuracy_rate).toBe(0);
      expect(response.body.flashcards.total_reviews).toBe(0);
    });
  });
});
