import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

// Sitio estático. Genera HTML puro, 0 JS por defecto.
export default defineConfig({
  // Dominio del sitio: usado por sitemap.xml, canonical, hreflang y og:image.
  // Ahora la web vive en Netlify; cuando el DNS de campeonatopasoslibres.com apunte
  // aquí, cambia esta línea a 'https://campeonatopasoslibres.com' (y el robots.txt).
  site: 'https://lanegraworld.netlify.app',
  build: { format: 'directory' },
  vite: {
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
  },
});
