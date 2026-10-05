// Alta de artistas → Airtable (tabla "Artistas").
// Netlify Function (v2). Endpoint: /.netlify/functions/artistas
//
// Variables de entorno (se configuran en Netlify, NO en el código):
//   ARTISTAS_PASSWORD      → contraseña que se pasa a los artistas por WhatsApp.
//                            Si no existe, se usa INSCRIPCION_PASSWORD.
//   AIRTABLE_TOKEN         → Personal Access Token (scopes: data.records:write)
//   AIRTABLE_BASE_ID       → id de la base (empieza por "app...")
//   AIRTABLE_TABLA_ARTISTAS→ nombre de la tabla (por defecto "Artistas")
//
// El cuerpo es JSON. Dos acciones:
//   { action: "auth",   password }                           → valida la contraseña
//   { action: "submit", password, fields:{...}, photo:{...} } → crea el registro

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });

const REQUIRED = ["nombre", "apellidos", "pais", "estilo", "especialidad", "trayectoria"];
const ESTILOS = ["Salsa", "Bachata", "Ambos"];
const MAX_FOTO = 5 * 1024 * 1024;

// Acepta un perfil completo o un usuario suelto; devuelve siempre URL o "".
const red = (valor, dominio) => {
  const v = String(valor || "").trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${dominio}/${v.replace(/^@/, "")}`;
};

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  const PASS = process.env.ARTISTAS_PASSWORD || process.env.INSCRIPCION_PASSWORD;
  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE = process.env.AIRTABLE_BASE_ID;
  const TABLE = process.env.AIRTABLE_TABLA_ARTISTAS || "Artistas";

  let body;
  try { body = await req.json(); } catch { return json({ error: "JSON inválido" }, 400); }

  if (!PASS) return json({ error: "Servidor sin configurar (falta ARTISTAS_PASSWORD)." }, 500);
  if (!body || typeof body.password !== "string" || body.password !== PASS) {
    return json({ error: "Contraseña incorrecta." }, 401);
  }

  if (body.action === "auth") return json({ ok: true });

  if (!TOKEN || !BASE) return json({ error: "Servidor sin configurar (faltan claves de Airtable)." }, 500);

  const f = (body.fields && typeof body.fields === "object") ? body.fields : {};
  for (const k of REQUIRED) {
    if (!f[k] || !String(f[k]).trim()) return json({ error: `Falta un campo obligatorio: ${k}` }, 400);
  }
  if (!ESTILOS.includes(String(f.estilo))) return json({ error: "Estilo no válido." }, 400);
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(f.email))) {
    return json({ error: "Email no válido." }, 400);
  }
  if (!f.acepta_rgpd) return json({ error: "Falta el consentimiento de datos." }, 400);

  const fields = {
    "Nombre": String(f.nombre).trim(),
    "Apellidos": String(f.apellidos).trim(),
    "País": String(f.pais).trim(),
    "Estilo": String(f.estilo),
    "Especialidad": String(f.especialidad).trim(),
    "Trayectoria": String(f.trayectoria).trim(),
    "Premios": f.premios ? String(f.premios).trim() : "",
    "Instagram": red(f.instagram, "instagram.com"),
    "YouTube": String(f.youtube || "").trim(),
    "Facebook": red(f.facebook, "facebook.com"),
    "Email": f.email ? String(f.email).trim() : "",
    "Idioma": String(f.idioma || "es").toUpperCase(),
    "Acepta RGPD": true,
    "Estado": "Pendiente",
  };

  // 1) Crear el registro
  let recId;
  try {
    const res = await fetch(`https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "content-type": "application/json" },
      body: JSON.stringify({ records: [{ fields }], typecast: true }),
    });
    if (!res.ok) return json({ error: "No se pudo guardar en Airtable.", detail: await res.text() }, 502);
    const data = await res.json();
    recId = data.records?.[0]?.id;
  } catch (e) {
    return json({ error: "Error de conexión con Airtable.", detail: String(e) }, 502);
  }

  // 2) Subir la foto de prensa al campo "Foto" (si viene). Tope de 5 MB también aquí.
  if (recId && body.photo?.base64 && body.photo?.type) {
    const bytes = Math.floor((String(body.photo.base64).length * 3) / 4);
    if (bytes > MAX_FOTO) {
      return json({ ok: true, recordId: recId, photoWarning: "La foto supera los 5 MB y no se ha adjuntado." });
    }
    try {
      const up = await fetch(`https://content.airtable.com/v0/${BASE}/${recId}/Foto/uploadAttachment`, {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}`, "content-type": "application/json" },
        body: JSON.stringify({
          contentType: body.photo.type,
          filename: body.photo.name || "foto.jpg",
          file: body.photo.base64,
        }),
      });
      if (!up.ok) return json({ ok: true, recordId: recId, photoWarning: await up.text() });
    } catch (e) {
      return json({ ok: true, recordId: recId, photoWarning: String(e) });
    }
  }

  return json({ ok: true, recordId: recId });
};
