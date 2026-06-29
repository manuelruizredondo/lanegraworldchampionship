import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

// Sitio estático. Genera HTML puro, 0 JS por defecto.
export default defineConfig({
  site: 'https://campeonatopasoslibres.com',
  build: { format: 'directory' },
  vite: {
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
  },
});
