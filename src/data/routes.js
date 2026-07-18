// Equivalencias de rutas entre idiomas (ES / EN / IT).
// Usado por: hreflang en <head>, selector de idioma (mantiene la página al cambiar) y sitemap.

export const ROUTES = [
  { es: "/", en: "/en/", it: "/it/" },
  { es: "/competicion/", en: "/en/competition/", it: "/it/competition/" },
  { es: "/bases-y-reglamento/", en: "/en/competition-rules/", it: "/it/regolamento/" },
  { es: "/festival/", en: "/en/festival/", it: "/it/festival/" },
  { es: "/artistas/", en: "/en/artists/", it: "/it/artists/" },
  { es: "/talleres/", en: "/en/workshops/", it: "/it/workshops/" },
  { es: "/programacion/", en: "/en/schedule/", it: "/it/programma/" },
  { es: "/fiesta/", en: "/en/fiesta/", it: "/it/fiesta/" },
  { es: "/competidores/", en: "/en/competitors/", it: "/it/competitors/" },
  { es: "/ganadores-2025/", en: "/en/winners-2025/", it: "/it/winners-2025/" },
  { es: "/ganadores/", en: "/en/winners/", it: "/it/winners/" },
  { es: "/ediciones/", en: "/en/editions/", it: "/it/edizioni/" },
  { es: "/videos/", en: "/en/videos/", it: "/it/videos/" },
  { es: "/galeria-2024/", en: "/en/gallery-2024/", it: "/it/gallery-2024/" },
  { es: "/galeria-2023/", en: "/en/gallery-2023/", it: "/it/gallery-2023/" },
  { es: "/tu-pase/", en: "/en/your-pass/", it: "/it/your-pass/" },
  { es: "/aviso-legal/", en: "/en/legal-notice/", it: "/it/legal-notice/" },
  { es: "/politica-de-privacidad/", en: "/en/privacy-policy/", it: "/it/privacy-policy/" },
  { es: "/cookies/", en: "/en/cookie-policy/", it: "/it/cookie-policy/" },
];

// Devuelve la fila de equivalencias de una ruta (o undefined si no está mapeada)
export function routeFor(pathname) {
  const p = pathname.endsWith("/") ? pathname : pathname + "/";
  return ROUTES.find((r) => r.es === p || r.en === p || r.it === p);
}
