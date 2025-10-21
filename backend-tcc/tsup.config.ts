import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    server: "src/server.ts",
    seed: "src/db/seed.ts",
  },
  splitting: false,
  sourcemap: true, // ✅ Sourcemaps para debug
  clean: true,
  outDir: "build",
  format: ["cjs"],
  bundle: true, // ✅ Fazer bundle do código do projeto
  external: [
    // ✅ Externalizar todas as dependências principais
    "fastify",
    "@fastify/*",
    "drizzle-orm",
    "pg",
    "bcryptjs",
    "dotenv",
    "zod",
    "dayjs",
    "@ai-sdk/google",
    "ai",
  ],
  target: "node18",
  minify: false,
  shims: true,
  outExtension: () => ({ js: ".cjs" }),
});