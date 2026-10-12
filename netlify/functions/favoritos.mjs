// Favoritos de la programación → Supabase.
// Netlify Function (v2). Endpoint: /.netlify/functions/favoritos
//
// Variables de entorno (se configuran en Netlify, NO en el código):
//   SUPABASE_URL          → https://xxxx.supabase.co
//   SUPABASE_SERVICE_KEY  → service_role key. NUNCA va al navegador.
//
// Dos acciones (POST, JSON):
//   { action: "guardar",   email, claves: [...], idioma }  → sustituye sus favoritos
//   { action: "recuperar", email }                         → devuelve sus claves
//
// Los favoritos siguen viviendo en el móvil (localStorage). Esto es un extra
// para no perderlos al cambiar de dispositivo: si Supabase falla, la página
// sigue funcionando igual.

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });

const MENSAJE = {
  es: { email: "Escribe un email válido.", servidor: "No se ha podido guardar. Inténtalo en un momento.",
        vacio: "No hay favoritos guardados con ese email." },
  en: { email: "Please enter a valid email.", servidor: "We couldn't save. Please try again in a moment.",
        vacio: "There are no favourites saved with that email." },
  it: { email: "Inserisci un'email valida.", servidor: "Non siamo riusciti a salvare. Riprova tra un momento.",
        vacio: "Non ci sono preferiti salvati con questa email." },
};

const MAX_FAVORITOS = 200;

// La clave viene de Programa.astro: "dia|hora|sala|título".
function desglosa(clave) {
  const p = String(clave).split("|");
  const dia = Number.parseInt(p[0], 10);
  return {
    clave: String(clave).slice(0, 400),
    dia: Number.isInteger(dia) ? dia : null,
    sala: (p[2] || "").slice(0, 10) || null,
    titulo: (p.slice(3).join("|") || "").slice(0, 300) || null,
  };
}

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  let body;
  try { body = await req.json(); } catch { return json({ error: "JSON inválido" }, 400); }

  const idioma = ["es", "en", "it"].includes(body?.idioma) ? body.idioma : "es";
  const m = MENSAJE[idioma];

  const email = String(body?.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: m.email }, 400);

  const URL_SB = process.env.SUPABASE_URL;
  const KEY = process.env.SUPABASE_SERVICE_KEY;
  if (!URL_SB || !KEY) return json({ error: "Servidor sin configurar (faltan claves de Supabase)." }, 500);

  const api = `${URL_SB.replace(/\/$/, "")}/rest/v1/favoritos`;
  const cabeceras = {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    "content-type": "application/json",
  };
  const filtro = `email=eq.${encodeURIComponent(email)}`;

  // ── Recuperar ────────────────────────────────────────────────────────────
  if (body.action === "recuperar") {
    try {
      const res = await fetch(`${api}?${filtro}&select=clave`, { headers: cabeceras });
      if (!res.ok) return json({ error: m.servidor, detail: await res.text() }, 502);
      const filas = await res.json();
      return json({ ok: true, claves: filas.map((f) => f.clave), vacio: filas.length === 0, mensajeVacio: m.vacio });
    } catch (e) {
      return json({ error: m.servidor, detail: String(e) }, 502);
    }
  }

  // ── Guardar ──────────────────────────────────────────────────────────────
  const claves = Array.isArray(body?.claves) ? [...new Set(body.claves.map(String))] : null;
  if (!claves || claves.length > MAX_FAVORITOS) return json({ error: m.servidor }, 400);

  try {
    // Se sustituye el conjunto entero: así desmarcar también se propaga.
    const borrado = await fetch(`${api}?${filtro}`, { method: "DELETE", headers: cabeceras });
    if (!borrado.ok) return json({ error: m.servidor, detail: await borrado.text() }, 502);

    if (claves.length) {
      const filas = claves.map((c) => ({ email, idioma, ...desglosa(c) }));
      const res = await fetch(api, {
        method: "POST",
        headers: { ...cabeceras, Prefer: "return=minimal" },
        body: JSON.stringify(filas),
      });
      if (!res.ok) return json({ error: m.servidor, detail: await res.text() }, 502);
    }
    return json({ ok: true, guardados: claves.length });
  } catch (e) {
    return json({ error: m.servidor, detail: String(e) }, 502);
  }
};
