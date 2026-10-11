// Recuento de la votación del repertorio de Dani J.
// Netlify Function (v2). Endpoint: /.netlify/functions/votacion-resultados
//
// Variables de entorno (las mismas que el resto del panel):
//   ADMIN_PASSWORD (si no existe, se usa INSCRIPCION_PASSWORD)
//   AIRTABLE_TOKEN · AIRTABLE_BASE_ID · AIRTABLE_TABLA_VOTACION
//
// Cuerpo JSON: { password }
//
// Devuelve dos recuentos, porque no dicen lo mismo:
//   · PUNTOS  → voto ponderado: 10 puntos al nº 1 de cada persona … 1 al nº 10.
//               Premia que una canción salga alta, no solo que salga.
//   · VOTOS   → cuánta gente la ha metido en su top, sin mirar la posición.
// Para armar el repertorio manda PUNTOS; VOTOS sirve para ver si una canción
// gana por mucha gente que la pone décima o por poca que la pone primera.

import { CANCIONES, MAX_VOTOS } from "../../src/data/danij.js";

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  const PASS = process.env.ADMIN_PASSWORD || process.env.INSCRIPCION_PASSWORD;
  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE = process.env.AIRTABLE_BASE_ID;
  const TABLE = process.env.AIRTABLE_TABLA_VOTACION || "Votación Dani J";

  let body;
  try { body = await req.json(); } catch { return json({ error: "JSON inválido" }, 400); }

  if (!PASS) return json({ error: "Servidor sin configurar (falta ADMIN_PASSWORD)." }, 500);
  if (!body || body.password !== PASS) return json({ error: "Contraseña incorrecta." }, 401);
  if (!TOKEN || !BASE) return json({ error: "Servidor sin configurar (faltan claves de Airtable)." }, 500);

  const api = `https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}`;
  const auth = { Authorization: `Bearer ${TOKEN}` };

  try {
    const records = [];
    let offset;
    do {
      const url = new URL(api);
      url.searchParams.set("pageSize", "100");
      if (offset) url.searchParams.set("offset", offset);
      const res = await fetch(url, { headers: auth });
      if (!res.ok) return json({ error: "No se pudo leer Airtable.", detail: await res.text() }, 502);
      const data = await res.json();
      records.push(...(data.records || []));
      offset = data.offset;
    } while (offset);

    const conocida = new Set(CANCIONES);
    const puntos = new Map();
    const votos = new Map();
    const primeros = new Map();   // cuántas veces es la nº 1 de alguien
    const porIdioma = {};
    let votantes = 0;
    let papeletas = 0;            // canciones marcadas en total
    const descartadas = new Set(); // títulos en Airtable que no están en la lista

    for (const r of records) {
      const f = r.fields || {};
      votantes++;
      const idioma = f.Idioma || "—";
      porIdioma[idioma] = (porIdioma[idioma] || 0) + 1;
      for (let i = 1; i <= MAX_VOTOS; i++) {
        const c = (f[`Voto ${i}`] || "").trim();
        if (!c) continue;
        if (!conocida.has(c)) { descartadas.add(c); continue; }
        papeletas++;
        puntos.set(c, (puntos.get(c) || 0) + (MAX_VOTOS - i + 1));
        votos.set(c, (votos.get(c) || 0) + 1);
        if (i === 1) primeros.set(c, (primeros.get(c) || 0) + 1);
      }
    }

    const ranking = [...puntos.keys()]
      .map((c) => ({
        cancion: c,
        puntos: puntos.get(c) || 0,
        votos: votos.get(c) || 0,
        primeros: primeros.get(c) || 0,
      }))
      // Desempate: primero puntos, luego cuánta gente la votó, luego nº 1.
      .sort((a, b) => b.puntos - a.puntos || b.votos - a.votos || b.primeros - a.primeros)
      .map((x, i) => ({ puesto: i + 1, ...x }));

    return json({
      ok: true,
      votantes,
      papeletas,
      porIdioma,
      sinVotos: CANCIONES.filter((c) => !puntos.has(c)).length,
      descartadas: [...descartadas],
      ranking,
    });
  } catch (e) {
    return json({ error: "Error de conexión con Airtable.", detail: String(e) }, 502);
  }
};
