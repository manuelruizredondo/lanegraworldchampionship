import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

// Sitio estático. Genera HTML puro, 0 JS por defecto.
export default defineConfig({
  // Dominio del sitio: usado por sitemap.xml, canonical, hreflang y og:image.
  // El DNS de campeonatopasoslibres.com ya apunta a Netlify (jul 2026).
  site: 'https://campeonatopasoslibres.com',
  build: { format: 'directory' },
  vite: {
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
  },
});
