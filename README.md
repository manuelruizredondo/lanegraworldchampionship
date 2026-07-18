# La Negra Dance Festival — sitio en Astro

Reconstrucción completa de [campeonatopasoslibres.com](https://campeonatopasoslibres.com/)
(WordPress/Avada) a un **sitio estático Astro**, **trilingüe (ES / EN / IT)**, rápido y sin
dependencias de PHP/plugins. Diseño propio "Board" (tipografía Inter, acento dorado).

## Comandos
```bash
npm install      # dependencias
npm run dev      # desarrollo (http://localhost:4321)
npm run build    # sitio estático en dist/
npm run preview  # sirve dist/ en local
```
Despliegue en **Netlify** (`netlify.toml`: build `npm run build`, publish `dist`).

---

## Novedades frente a la web original

> Resumen breve de todo lo que diferencia esta versión de la WordPress original.

### Base técnica
- Reconstruido en **Astro estático** (sin WordPress/PHP/Avada): más rápido, seguro y barato.
- **Trilingüe real** (ES/EN/IT) con rutas por idioma, `hreflang` y selector que mantiene la página.
- `sitemap.xml`, `robots`, metadatos y `og:image`/`twitter:image` por página.

### Diseño ("Board")
- Tipografía **Inter**, acento dorado, botones píldora, tarjetas redondeadas y más aire.
- **Homes** con hero en **vídeo**, marquesina de fuego, artistas en **"bolas" orgánicas**,
  **mapa de nacionalidades** interactivo, **cuenta atrás** y bloque de valores.
- **Todas** las páginas internas migradas a este diseño (antes eran el layout Avada).
- **Heros con imagen de fondo** en Festival y El Mundial (clase reutilizable `.p-phero`).

### Navegación / arquitectura
- Menú en 4 bloques: **Mundial · Festival · Galería · Contacto**, en minúscula con inicial mayúscula.
- **Mundial** lleva a su portada `/mundial/`; submenú con hubs (**Ediciones anteriores**, **Vídeos**).
- **Pases unificados**: Full Pass, Pase competidor y CTA apuntan al mismo destino `/tu-pase/`.
- **Hotel** del menú lleva a la sección interna (info + reserva) en vez de saltar fuera.
- Menú móvil (drawer) con un único fondo (se quitó el doble azul del submenú).

### Secciones y páginas nuevas
- **El Mundial** (`/mundial/`): qué es el campeonato, disciplinas (Salsa XV / Bachata V) **con
  botón a sus bases**, categorías, formato, historia e **Instagram** del Mundial.
- **Bases y Reglamento**: los PDF de salsa y bachata convertidos en **páginas web** (con pestañas),
  **traducidas a EN e IT**, enlazadas desde el menú.
- **Vídeos** (`/videos/`): **47 vídeos ganadores** de 6 ediciones (2025→2018), reproducción **inline**.
- **Ediciones anteriores** (`/ediciones/`) y **portada de Galería** (`/galeria/`): hubs por año.
- **Contacto** (`/contacto/`): página propia con formulario, WhatsApp y redes (antes era un ancla).

### Funcionalidades
- **Programación → Talleres**: horario tipo Google Calendar (eje de horas, días en pestañas, salas,
  filtros, buscador, **favoritos**, **fichas de artista**). En modo **"Próximamente"** (atenuado y
  sin interacción) hasta conocer los talleres 2026; `/programacion/` redirige a `/talleres/`.
- **Galerías** con lightbox: abrir en grande + **flechas, contador, teclado y swipe**.
- **Ganadores 2025/2024**: pulsar la foto de una categoría **abre el vídeo del campeón** en una ventana.
- **Artistas**: fotos en "bolas" + fichas/bios en modal.

### Multimedia / rendimiento
- Vídeo del hero servido por **Cloudinary** con `poster` (sin flash negro) y **−32 MB** de vídeos sin usar eliminados.
- Imágenes locales optimizadas (WebP), `loading="lazy"` y `alt` en todas.

### Formularios / RGPD / analítica
- **Formulario de contacto** conectado a **Netlify Forms** (antes no enviaba nada) y **newsletter** en el pie.
- **Banner de cookies + Google Tag Manager** con **consentimiento previo** (opt-in RGPD).

### SEO / accesibilidad
- **Un solo H1** por página, títulos localizados, descripciones en todas.
- **JSON-LD** (schema Festival/Organización), foco atrapado en modales, enlace "saltar al contenido",
  navegación por teclado y `aria-label` en los campos de formulario.

### Marca / contenido
- Nombre corregido: **"La Negra World Championship" → "La Negra Dance Festival"**.
- Botón de hotel **"Reserva tu hotel"**, foto real del **Gran Salón del Mundial**, tarjetas del horario
  por tipo (Mundial dorado / Social azul noche / etc.) y subtítulos de galería traducidos.

---

## Estructura
```
src/
  layouts/Base.astro         # head, Header, Footer, Analytics, WhatsApp
  components/                # Header, Footer, Programa, Reglamento, Videos, Mundial, Contacto, Lightbox, VideoModal…
  data/                      # nav.js, routes.js, programa.js, reglamento.js, videos.js, artist-bios.js, img.js
  styles/                    # global.css + proposal.css (sistema Board `.p-*`)
  pages/                     # una carpeta por ruta, ×3 idiomas
public/img/                  # imágenes (WebP) y assets
```

## Pendiente (fuera del código)
- Apuntar el **DNS** de `campeonatopasoslibres.com` a Netlify (ahora sirve la WordPress vieja).
- Activar **notificaciones de Netlify Forms** (contacto + newsletter) y crear la propiedad **GA4** en GTM.
