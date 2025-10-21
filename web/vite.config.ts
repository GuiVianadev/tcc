import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {visualizer} from 'rollup-plugin-visualizer'
import svgr from "vite-plugin-svgr"
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr(), visualizer({
      open: true,              // Abre automaticamente no navegador
      filename: 'stats.html',  // Nome do arquivo gerado
      gzipSize: true,          // Mostra tamanho com gzip
      brotliSize: true
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - Bibliotecas grandes separadas
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'ui-vendor': ['lucide-react', 'sonner'],


          'charts-vendor': ['recharts'], 


          // Feature chunks - Agrupar páginas relacionadas
          'materials-pages': [
            './src/pages/app/materials.tsx',
            './src/pages/app/create-material.tsx',
            './src/pages/app/material-flashcards.tsx',
            './src/pages/app/material-quizzes.tsx',
          ],
          'flashcards-pages': [
            './src/pages/app/flashcards.tsx',
            './src/pages/app/flashcard-review.tsx',
          ],
          'quiz-pages': [
            './src/pages/app/quizzes.tsx',
          ],
          'summary-pages': [
            './src/pages/app/summaries.tsx',
            './src/pages/app/summary-detail.tsx',
          ],
          'admin-pages': [
            './src/pages/admin/users.tsx',
            './src/pages/_layouts/admin.tsx',
          ],
        },
      },
    },
    // Aumentar limite de chunk para evitar warnings
    chunkSizeWarningLimit: 600,
  },
});
