import { z } from "zod";

const DEFAULT_PORT = 3333;
const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  PORT: z.coerce.number().default(DEFAULT_PORT),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
  FRONTEND_URL: z.string().optional(), // URL do frontend para CORS em produção
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(), // Chave da API do Gemini
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  // biome-ignore lint/suspicious/noConsole: <Validation>
  console.error(z.treeifyError(_env.error));

  throw new Error("Invalid enviroment variables.");
}

export const env = _env.data;
