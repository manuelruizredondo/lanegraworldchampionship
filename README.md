# La Negra Dance Festival — sitio en Astro

Réplica estática y responsive de [campeonatopasoslibres.com](https://campeonatopasoslibres.com/),
reconstruida desde cero con **Astro**. Sin WordPress, sin PHP, sin Avada y **sin ninguna
referencia a `wp-content`/`fusion`/`avada`**. Bilingüe (ES / EN). 0 JS por defecto (solo un
pequeño script para el menú flyout).

## Requisitos
- Node 18+ (recomendado 20)

## Comandos
```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo (http://localhost:4321)
npm run build    # genera el sitio estático en dist/
npm run preview  # sirve dist/ en local
```

## Desplegar en Netlify
El repo incluye `netlify.toml` (build `npm run build`, publish `dist`). Conecta el repositorio
en Netlify o arrastra la carpeta tras `npm run build`. Astro genera `404.html` automáticamente.

## Estructura
```
src/
  layouts/Base.astro        # layout (head, Header, Footer) con prop `lang`
  components/Header.astro    # cabecera + menú flyout lateral (derecha, 1/3, con easing)
  components/Footer.astro    # patrocinadores, redes, legales
  data/nav.js                # menús, CTA, legales y conmutador de idioma (ES/EN)
  data/img.js + img-manifest.json  # helper img() que resuelve nombres → /img/...
  styles/global.css          # tokens de diseño + clases utilitarias
  pages/                     # una carpeta por ruta (index.astro -> /ruta/)
public/
  img/                       # imágenes y vídeos del sitio
  fonts/                     # Anja Eliane (títulos) y Amarillo (cursiva)
```

## Páginas (30 — ES + EN)
**Español:** `/`, `/competicion/`, `/festival/`, `/artistas/`, `/competidores/`,
`/ganadores/`, `/ganadores-2025/`, `/tu-pase/`, `/talleres/`, `/fiesta/`,
`/galeria-2023/`, `/galeria-2024/`, `/aviso-legal/`, `/politica-de-privacidad/`, `/cookies/`.

**English (`/en/`):** `/en/`, `/en/competition/`, `/en/festival/`, `/en/artists/`,
`/en/competitors/`, `/en/winners/`, `/en/winners-2025/`, `/en/your-pass/`, `/en/workshops/`,
`/en/fiesta/`, `/en/gallery-2023/`, `/en/gallery-2024/`, `/en/legal-notice/`,
`/en/privacy-policy/`, `/en/cookie-policy/`.

## Diseño
- Tipografías: **Anja Eliane** (títulos grandes), **Amarillo** (cursiva de las etiquetas),
  **Roboto Condensed** (cuerpo). Las dos primeras se sirven en local desde `public/fonts/`.
- Paleta: oro `#cc9933`, oro oscuro `#a28243`, navy `#0f0b1e`, azul `#3d436d`, crema `#f6f2ec`.
- Helper `img("nombre.ext")` para no depender de rutas; resuelve al archivo correcto en `/img/`.

## Notas
- El vídeo de cabecera se reproduce en bucle (como el original). Para congelarlo a una imagen,
  cambia el `<video autoplay…>` de la home por un `<img>` con su póster.
- La página *Tu Pase / Your Pass* incluye un bloque de compra que enlaza al sistema de
  entradas externo (go&dance); la cuenta atrás es estática.
