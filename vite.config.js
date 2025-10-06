import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'gzip', // Ou 'brotliCompress' para Brotli
      ext: '.gz', // Adiciona a extensão .gz aos arquivos gerados
    }),
  ],
  server: {
    port: 3030,
    open: true,
  },
});
