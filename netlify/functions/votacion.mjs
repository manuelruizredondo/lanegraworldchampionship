// Votación del repertorio del concierto de Dani J → Airtable.
// Netlify Function (v2). Endpoint: /.netlify/functions/votacion
//
// Variables de entorno (se configuran en Netlify, NO en el código):
//   AIRTABLE_TOKEN          → Personal Access Token (scopes: data.records:read y :write)
//   AIRTABLE_BASE_ID        → id de la base (empieza por "app...")
//   AIRTABLE_TABLA_VOTACION → nombre de la tabla (por defecto "Votación Dani J")
//
// Cuerpo JSON: { email, canciones: ["...", ...], idioma }
// El ORDEN del array es el voto: canciones[0] es la favorita.

import { CANCIONES, MAX_VOTOS, CIERRE } from "../../src/data/danij.js";

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });

const MENSAJE = {
  es: {
    cerrada: "La votación se cerró el 24 de octubre a las 21:00.",
    repetida: "Con este email ya se ha votado. Solo se admite una votación por persona.",
    email: "Escribe un email válido.",
    lista: "Selecciona entre 1 y 10 canciones.",
    desconocida: "Hay una canción que no está en la lista.",
    servidor: "No se ha podido guardar tu votación. Inténtalo de nuevo en un momento.",
  },
  en: {
    cerrada: "Voting closed on 24 October at 21:00.",
    repetida: "This email has already voted. Only one vote per person is allowed.",
    email: "Please enter a valid email.",
    lista: "Select between 1 and 10 songs.",
    desconocida: "One of the songs is not on the list.",
    servidor: "We couldn't save your vote. Please try again in a moment.",
  },
  it: {
    cerrada: "La votazione si è chiusa il 24 ottobre alle 21:00.",
    repetida: "Con questa email si è già votato. È ammesso un solo voto a persona.",
    email: "Inserisci un'email valida.",
    lista: "Seleziona da 1 a 10 canzoni.",
    desconocida: "Una delle canzoni non è in elenco.",
    servidor: "Non siamo riusciti a salvare il tuo voto. Riprova tra un momento.",
  },
};

// Comillas simples dentro de una fórmula de Airtable.
const escapa = (s) => String(s).replace(/'/g, "\\'");

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  let body;
  try { body = await req.json(); } catch { return json({ error: "JSON inválido" }, 400); }

  const idioma = ["es", "en", "it"].includes(body?.idioma) ? body.idioma : "es";
  const m = MENSAJE[idioma];

  // El cierre se comprueba aquí, no solo en la página: la página es estática y
  // podría estar cacheada en el móvil de alguien mucho después del plazo.
  if (Date.now() > Date.parse(CIERRE)) return json({ error: m.cerrada }, 403);

  const email = String(body?.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: m.email }, 400);

  const canciones = Array.isArray(body?.canciones) ? body.canciones.map(String) : [];
  if (!canciones.length || canciones.length > MAX_VOTOS) return json({ error: m.lista }, 400);
  if (new Set(canciones).size !== canciones.length) return json({ error: m.lista }, 400);
  const catalogo = new Set(CANCIONES);
  if (canciones.some((c) => !catalogo.has(c))) return json({ error: m.desconocida }, 400);

  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE = process.env.AIRTABLE_BASE_ID;
  const TABLE = process.env.AIRTABLE_TABLA_VOTACION || "Votación Dani J";
  if (!TOKEN || !BASE) return json({ error: "Servidor sin configurar (faltan claves de Airtable)." }, 500);

  const url = `https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}`;
  const cabeceras = { Authorization: `Bearer ${TOKEN}`, "content-type": "application/json" };

  // 1) ¿Ha votado ya este email?
  try {
    const filtro = encodeURIComponent(`LOWER({Email}) = '${escapa(email)}'`);
    const res = await fetch(`${url}?filterByFormula=${filtro}&maxRecords=1&fields%5B%5D=Email`, { headers: cabeceras });
    if (res.ok) {
      const data = await res.json();
      if (data.records?.length) return json({ error: m.repetida }, 409);
    }
    // Si la consulta falla no se bloquea el voto: es peor perder un voto real
    // que permitir un duplicado, que luego se ve en la tabla.
  } catch { /* se continúa */ }

  // 2) Guardar. Una fila por persona: Voto 1…Voto 10 en orden, más el top
  //    completo en texto para poder leerlo de un vistazo.
  const fields = {
    Email: email,
    Idioma: idioma.toUpperCase(),
    "Nº de votos": canciones.length,
    "Top elegido": canciones.map((c, i) => `${i + 1}. ${c}`).join("\n"),
  };
  canciones.forEach((c, i) => { fields[`Voto ${i + 1}`] = c; });

  const escribir = (f) => fetch(url, {
    method: "POST",
    headers: cabeceras,
    body: JSON.stringify({ records: [{ fields: f }], typecast: true }),
  });

  try {
    let res = await escribir(fields);

    // Airtable rechaza el registro ENTERO si alguno de los campos no existe en
    // la tabla. Antes que perder el voto, se reintenta con lo imprescindible:
    // el email y las diez posiciones. Lo demás (idioma, recuento, top en texto)
    // es comodidad para leer la tabla, no el voto.
    if (!res.ok) {
      const texto = await res.text();
      if (/UNKNOWN_FIELD_NAME/i.test(texto)) {
        const minimo = { Email: fields.Email };
        canciones.forEach((c, i) => { minimo[`Voto ${i + 1}`] = c; });
        res = await escribir(minimo);
        if (!res.ok) return json({ error: m.servidor, detail: await res.text() }, 502);
      } else {
        return json({ error: m.servidor, detail: texto }, 502);
      }
    }

    const data = await res.json();
    return json({ ok: true, recordId: data.records?.[0]?.id });
  } catch (e) {
    return json({ error: m.servidor, detail: String(e) }, 502);
  }
};
