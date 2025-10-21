import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts"],
  splitting: false,
  sourcemap: false,
  clean: true,
  outDir: "build",
  format: ["cjs"],
  bundle: false,
  skipNodeModulesBundle: true,
  target: "node18",
  minify: false,
  shims: true,
  noExternal: [],
});