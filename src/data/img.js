import manifest from "./img-manifest.json";

// Resuelve el nombre de un archivo de imagen a su ruta pública (/img/...).
// Acepta el nombre base (p.ej. "festival-negra-dance-home-1.jpg") o una ruta /img/... ya válida.
export function img(name) {
  if (!name) return "";
  if (name.startsWith("/img/") || name.startsWith("http")) return name;
  const file = name.split("/").pop();
  return manifest[file] || `/img/${file}`;
}
