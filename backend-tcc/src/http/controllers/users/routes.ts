import type { FastifyInstance } from "fastify";
import { verifyUserRole } from "@/middlewares/verify-user-role.ts";
import { verifyJWT } from "../../../middlewares/verify-jwt.ts";
import { autheticate } from "./authenticate.ts";
import { deleteUser } from "./delete.ts";
import { logout } from "./logout.ts";
import { profile } from "./profile.ts";
import { refresh } from "./refresh.ts";
import { register } from "./register.ts";
import { update } from "./update.ts";
import { getUsers } from "./get-users.ts";
import { getUserStatistics } from "./get-user-statistics.controller.ts";

// biome-ignore lint/suspicious/useAwait: This code need be async but without await
export async function userRoutes(app: FastifyInstance) {
  app.post("/users/register", register);
  app.post("/users/login", autheticate);
  app.post("/users/logout", logout);

  app.patch("/users/token/refresh", refresh);

  app.get("/me", { onRequest: [verifyJWT] }, profile);
  app.get("/users/me/statistics", { onRequest: [verifyJWT] }, getUserStatistics);
  app.delete("/users/delete", { onRequest: [verifyJWT] }, deleteUser);
  app.patch("/user/update", { onRequest: [verifyJWT] }, update);

  app.get("/users", { onRequest: [verifyJWT,verifyUserRole("admin")] }, getUsers);
}
