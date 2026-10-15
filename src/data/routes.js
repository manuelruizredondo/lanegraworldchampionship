// Equivalencias de rutas entre idiomas (ES / EN / IT).
// Usado por: hreflang en <head>, selector de idioma (mantiene la página al cambiar) y sitemap.

export const ROUTES = [
  { es: "/", en: "/en/", it: "/it/" },
  { es: "/competicion/", en: "/en/competition/", it: "/it/competition/" },
  { es: "/mundial/", en: "/en/world-championship/", it: "/it/mondiale/" },
  { es: "/bases-y-reglamento/", en: "/en/competition-rules/", it: "/it/regolamento/" },
  { es: "/festival/", en: "/en/festival/", it: "/it/festival/" },
  { es: "/artistas/", en: "/en/artists/", it: "/it/artists/" },
  { es: "/programacion-2026/", en: "/en/programme-2026/", it: "/it/programma-2026/" },
  { es: "/ponencias/", en: "/en/talks/", it: "/it/conferenze/" },
  { es: "/en-directo/", en: "/en/live/", it: "/it/in-diretta/" },
  // Nota: /programacion/, /en/schedule/, /it/programma/ y las antiguas /talleres/,
  // /en/workshops/ y /it/workshops/ se redirigen con 301 desde netlify.toml; se dejan
  // FUERA de ROUTES para no meterlas en el
  // sitemap ni en el hreflang.
  { es: "/como-llegar/", en: "/en/getting-here/", it: "/it/come-arrivare/" },
  { es: "/fiesta/", en: "/en/fiesta/", it: "/it/fiesta/" },
  { es: "/competidores/", en: "/en/competitors/", it: "/it/competitors/" },
  { es: "/ganadores-2025/", en: "/en/winners-2025/", it: "/it/winners-2025/" },
  { es: "/ganadores/", en: "/en/winners/", it: "/it/winners/" },
  { es: "/ediciones/", en: "/en/editions/", it: "/it/edizioni/" },
  { es: "/videos/", en: "/en/videos/", it: "/it/videos/" },
  { es: "/galeria/", en: "/en/gallery/", it: "/it/gallery/" },
  { es: "/contacto/", en: "/en/contact/", it: "/it/contact/" },
  { es: "/galeria-2024/", en: "/en/gallery-2024/", it: "/it/gallery-2024/" },
  { es: "/galeria-2023/", en: "/en/gallery-2023/", it: "/it/gallery-2023/" },
  { es: "/tu-pase/", en: "/en/your-pass/", it: "/it/your-pass/" },
  { es: "/aviso-legal/", en: "/en/legal-notice/", it: "/it/legal-notice/" },
  { es: "/politica-de-privacidad/", en: "/en/privacy-policy/", it: "/it/privacy-policy/" },
  { es: "/cookies/", en: "/en/cookie-policy/", it: "/it/cookie-policy/" },
  // El escritorio de la cuenta es privado: fuera del sitemap y con noindex.
  // La del concierto de Dani J sí se indexa: vende la entrada suelta de 35 €.
  // Lleva además la votación del repertorio, que cierra el 24 de octubre;
  // pasada esa fecha hay que quitar ese bloque, no esconder la página.
  { es: "/cuenta/", en: "/en/account/", it: "/it/account/", sitemap: false },
  { es: "/concierto-danij/", en: "/en/concierto-danij/", it: "/it/concierto-danij/" },
];

// Devuelve la fila de equivalencias de una ruta (o undefined si no está mapeada)
export function routeFor(pathname) {
  const p = pathname.endsWith("/") ? pathname : pathname + "/";
  return ROUTES.find((r) => r.es === p || r.en === p || r.it === p);
}
