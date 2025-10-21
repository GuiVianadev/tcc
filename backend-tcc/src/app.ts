import { fastifyCookie } from "@fastify/cookie";
import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import fastify from "fastify";
import { env } from "./env/index.ts";
import { flashcardsRoutes } from "./http/controllers/flashcards/routes.ts";
import { materialsRoutes } from "./http/controllers/materials/routes.ts";
import { quizzesRoutes } from "./http/controllers/quizzes/routes.ts";
import { studyGoalsRoutes } from "./http/controllers/study-goals/routes.ts";
import { summariesRoutes } from "./http/controllers/summaries/routes.ts";
import { userRoutes } from "./http/controllers/users/routes.ts";

export const app = fastify();

// Configuração de CORS para desenvolvimento e produção
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
];

// Adiciona URL de produção se estiver configurada
if (env.FRONTEND_URL) {
  allowedOrigins.push(env.FRONTEND_URL);
}

app.register(cors, {
  origin: (origin, callback) => {
    // Permite requisições sem origin (ex: Postman, curl, SSR)
    if (!origin) {
      callback(null, true);
      return;
    }

    // Verifica se a origin está na lista permitida
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error(`Origin ${origin} not allowed by CORS`), false);
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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
    fileSize: 10 * SIZE_FILE * SIZE_FILE, 
  },
});

app.register(userRoutes);
app.register(materialsRoutes);
app.register(summariesRoutes);
app.register(quizzesRoutes);
app.register(flashcardsRoutes);
app.register(studyGoalsRoutes);
