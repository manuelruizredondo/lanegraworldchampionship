// Altas de la newsletter del pie → Supabase.
// Netlify Function (v2). Endpoint: /.netlify/functions/newsletter
//
// Variables de entorno (se configuran en Netlify, NO en el código):
//   SUPABASE_URL          → https://xxxx.supabase.co
//   SUPABASE_SERVICE_KEY  → service_role key. NUNCA va al navegador.
//
// Cuerpo JSON: { email, idioma, bot }
//
// El formulario sigue enviándose además a Netlify Forms. Esto es un segundo
// registro, el que lee el panel de la organización: si uno de los dos falla,
// el alta no se pierde.

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  let body;
  try { body = await req.json(); } catch { return json({ error: "JSON inválido" }, 400); }

  // Trampa para robots: el campo oculto del formulario viene relleno.
  if (String(body?.bot || "").trim()) return json({ ok: true, ignorado: true });

  const email = String(body?.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 180) {
    return json({ error: "Email no válido" }, 400);
  }
  const idioma = ["es", "en", "it"].includes(body?.idioma) ? body.idioma : "es";

  const URL_SB = process.env.SUPABASE_URL;
  const KEY = process.env.SUPABASE_SERVICE_KEY;
  if (!URL_SB || !KEY) return json({ error: "Servidor sin configurar" }, 500);

  try {
    // Si ya estaba suscrito, no es un error: se deja como estaba.
    const res = await fetch(`${URL_SB.replace(/\/$/, "")}/rest/v1/newsletter`, {
      method: "POST",
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        "content-type": "application/json",
        Prefer: "return=minimal,resolution=ignore-duplicates",
      },
      body: JSON.stringify([{ email, idioma, origen: "web" }]),
    });
    if (!res.ok) return json({ error: "No se ha podido guardar", detail: await res.text() }, 502);
    return json({ ok: true });
  } catch (e) {
    return json({ error: "No se ha podido guardar", detail: String(e) }, 502);
  }
};
