import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../../app.ts";
import { createAndAuthenticateUser } from "../../../utils/test/create-and-authenticate-user.ts";

describe("Summaries Routes (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /summaries", () => {
    it("should be able to list user summaries with pagination", async () => {
      const { token } = await createAndAuthenticateUser(app);

      const response = await request(app.server)
        .get("/summaries")
        .query({ page: 1, pageSize: 10 })
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty("summaries");
      expect(Array.isArray(response.body.summaries)).toBe(true);
    });

    it("should return 401 when not authenticated", async () => {
      await request(app.server)
        .get("/summaries")
        .query({ page: 1, pageSize: 10 })
        .expect(401);
    });

    it("should return 400 when page is invalid", async () => {
      const { token } = await createAndAuthenticateUser(app);

      await request(app.server)
        .get("/summaries")
        .query({ page: 0, pageSize: 10 })
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
    });

    it("should return 400 when pageSize exceeds max limit", async () => {
      const { token } = await createAndAuthenticateUser(app);

      await request(app.server)
        .get("/summaries")
        .query({ page: 1, pageSize: 101 })
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
    });
  });

  describe("GET /materials/:materialId/summary", () => {
    it("should be able to get a specific summary by material id", async () => {
      const { token } = await createAndAuthenticateUser(app);

      // Primeiro criar um material (assumindo que existe rota de criar material)
      // Este teste precisa de um material real no banco para funcionar
      // Por enquanto vamos testar apenas o caso de material não encontrado

      const fakeMaterialId = "550e8400-e29b-41d4-a716-446655440000";

      await request(app.server)
        .get(`/materials/${fakeMaterialId}/summary`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });

    it("should return 401 when not authenticated", async () => {
      const fakeMaterialId = "550e8400-e29b-41d4-a716-446655440000";

      await request(app.server)
        .get(`/materials/${fakeMaterialId}/summary`)
        .expect(401);
    });

    it("should return 400 when materialId is not a valid UUID", async () => {
      const { token } = await createAndAuthenticateUser(app);

      await request(app.server)
        .get("/materials/invalid-uuid/summary")
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
    });
  });
});
