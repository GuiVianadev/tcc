import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../../../middlewares/verify-jwt.ts";
import { autheticate } from "./authenticate.ts";
import { logout } from "./logout.ts";
import { profile } from "./profile.ts";
import { refresh } from "./refresh.ts";
import { register } from "./register.ts";

// biome-ignore lint/suspicious/useAwait: This code need be async but without await
export async function userRoutes(app: FastifyInstance) {
  app.post("/users/register", register);
  app.post("/users/login", autheticate);
  app.post("/users/logout", logout);

  app.patch("/users/token/refresh", refresh);

  app.get("/me", { onRequest: [verifyJWT] }, profile);

  // app.get("/me", { onRequest: [verifyUserRole('admin')] }, profile);
}
