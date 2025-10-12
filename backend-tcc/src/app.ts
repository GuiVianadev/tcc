import { fastifyCookie } from "@fastify/cookie";
import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import fastify from "fastify";
import { env } from "./env/index.ts";
import { materialsRoutes } from "./http/controllers/materials/routes.ts";
import { userRoutes } from "./http/controllers/users/routes.ts";

export const app = fastify();

app.register(cors, {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "10m",
  },
});

app.register(fastifyCookie);

const SIZE_FILE = 1024;

app.register(multipart, {
  limits: {
    fileSize: 10 * SIZE_FILE * SIZE_FILE, // 10MB
  },
});

app.register(userRoutes);
app.register(materialsRoutes);
