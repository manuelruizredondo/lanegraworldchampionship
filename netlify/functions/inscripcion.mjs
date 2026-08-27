// Inscripción de competidores → Airtable.
// Netlify Function (v2). Endpoint: /.netlify/functions/inscripcion
//
// Variables de entorno necesarias (se configuran en Netlify, NO en el código):
//   INSCRIPCION_PASSWORD  → password que da la organización para acceder al formulario
//   AIRTABLE_TOKEN        → Personal Access Token de Airtable (scopes: data.records:write)
//   AIRTABLE_BASE_ID      → id de la base (empieza por "app...")
//   AIRTABLE_TABLE        → nombre de la tabla (por defecto "Inscripciones")
//
// El cuerpo es JSON. Dos acciones:
//   { action: "auth",   password }                        → valida el password (para la "puerta")
//   { action: "submit", password, fields:{...}, photo:{...} } → valida y crea el registro

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });

const REQUIRED = ["nombre", "apellidos", "email", "telefono", "pais", "nacimiento", "especialidad", "video"];

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  const PASS = process.env.INSCRIPCION_PASSWORD;
  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE = process.env.AIRTABLE_BASE_ID;
  const TABLE = process.env.AIRTABLE_TABLE || "Inscripciones";

  let body;
  try { body = await req.json(); } catch { return json({ error: "JSON inválido" }, 400); }

  if (!PASS) return json({ error: "Servidor sin configurar (falta INSCRIPCION_PASSWORD)." }, 500);
  if (!body || typeof body.password !== "string" || body.password !== PASS) {
    return json({ error: "Contraseña incorrecta." }, 401);
  }

  // Solo comprobar la contraseña (puerta de acceso)
  if (body.action === "auth") return json({ ok: true });

  // --- Envío de la inscripción ---
  if (!TOKEN || !BASE) return json({ error: "Servidor sin configurar (faltan claves de Airtable)." }, 500);

  const f = (body.fields && typeof body.fields === "object") ? body.fields : {};
  for (const k of REQUIRED) {
    if (!f[k] || !String(f[k]).trim()) return json({ error: `Falta un campo obligatorio: ${k}` }, 400);
  }
  if (!f.acepta_bases || !f.acepta_rgpd) {
    return json({ error: "Debes aceptar las bases y el consentimiento de datos." }, 400);
  }
  // Validación ligera del email y del vídeo
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(f.email))) return json({ error: "Email no válido." }, 400);
  if (!/(youtube\.com|youtu\.be|instagram\.com)/i.test(String(f.video))) {
    return json({ error: "El vídeo debe ser un enlace de YouTube o Instagram." }, 400);
  }

  const fields = {
    "Nombre": String(f.nombre).trim(),
    "Apellidos": String(f.apellidos).trim(),
    "Email": String(f.email).trim(),
    "Teléfono": String(f.telefono).trim(),
    "País": String(f.pais).trim(),
    "Ciudad": f.ciudad ? String(f.ciudad).trim() : "",
    "Fecha de nacimiento": String(f.nacimiento).trim(),
    "Especialidad": String(f.especialidad).trim(),
    "Pareja/Equipo": f.grupo ? String(f.grupo).trim() : "",
    "Integrantes": f.integrantes ? String(f.integrantes).trim() : "",
    "Nº integrantes": f.n_integrantes ? Number(f.n_integrantes) : 1,
    "Academia": f.academia ? String(f.academia).trim() : "",
    "Vídeo": String(f.video).trim(),
    "Instagram": f.instagram ? String(f.instagram).trim() : "",
    "Observaciones": f.observaciones ? String(f.observaciones).trim() : "",
    "Acepta bases": !!f.acepta_bases,
    "Acepta RGPD": !!f.acepta_rgpd,
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

  // 2) Subir la foto como adjunto al campo "Foto" (si viene)
  if (recId && body.photo?.base64 && body.photo?.type) {
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
