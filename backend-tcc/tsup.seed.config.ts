import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/db/seed.ts"],
  splitting: false,
  sourcemap: false,
  clean: false, // Não limpar, pois o build principal já roda antes
  outDir: "build",
  format: ["cjs"],
  bundle: true, // Fazer bundle de todas as dependências
  skipNodeModulesBundle: false, // Incluir node_modules no bundle
  target: "node18",
  minify: false,
  shims: true,
  external: ["pg", "drizzle-orm", "bcryptjs", "dotenv"], // Externalizar apenas libs principais
  outExtension: () => ({ js: ".cjs" }),
});
