// Sitemap XML con las 45 páginas y anotaciones hreflang entre idiomas.
import { ROUTES } from "../data/routes.js";

export function GET(context) {
  const site = (context.site ?? new URL("https://campeonatopasoslibres.com")).href.replace(/\/$/, "");

  const urls = ROUTES.flatMap((r) =>
    ["es", "en", "it"].map(
      (l) => `  <url>
    <loc>${site}${r[l]}</loc>
    <xhtml:link rel="alternate" hreflang="es" href="${site}${r.es}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${site}${r.en}"/>
    <xhtml:link rel="alternate" hreflang="it" href="${site}${r.it}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${site}${r.es}"/>
  </url>`
    )
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
