// Inscripción de competidores → Supabase (principal) y Airtable (copia).
// Netlify Function (v2). Endpoint: /.netlify/functions/inscripcion
//
// Variables de entorno necesarias (se configuran en Netlify, NO en el código):
//   INSCRIPCION_PASSWORD  → password que da la organización para acceder al formulario
//   AIRTABLE_TOKEN        → Personal Access Token de Airtable (scopes: data.records:write)
//   AIRTABLE_BASE_ID      → id de la base (empieza por "app...")
//   AIRTABLE_TABLE        → nombre de la tabla (por defecto "Inscripciones")
//   SUPABASE_URL          → https://xxxx.supabase.co
//   SUPABASE_SERVICE_KEY  → service_role key. NUNCA va al navegador.
//
// Supabase es el registro principal; Airtable se mantiene como seguridad. Una
// solicitud solo se da por perdida si fallan LOS DOS.
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

  // --- Envío de la solicitud ---
  const SB_URL = process.env.SUPABASE_URL;
  const SB_KEY = process.env.SUPABASE_SERVICE_KEY;
  if ((!TOKEN || !BASE) && (!SB_URL || !SB_KEY)) {
    return json({ error: "Servidor sin configurar (no hay dónde guardar)." }, 500);
  }

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
    "Representa a": f.representa ? String(f.representa).trim() : "",
    "Ciudad": f.ciudad ? String(f.ciudad).trim() : "",
    "Fecha de nacimiento": String(f.nacimiento).trim(),
    "Especialidad": String(f.especialidad).trim(),
    "Pareja/Equipo": f.grupo ? String(f.grupo).trim() : "",
    "Integrantes": f.integrantes ? String(f.integrantes).trim() : "",
    "Nº integrantes": f.n_integrantes ? Number(f.n_integrantes) : 1,
    "Academia": f.academia ? String(f.academia).trim() : "",
    "Vídeo": String(f.video).trim(),
    "Instagram": f.instagram ? String(f.instagram).trim() : "",
    "Otras categorías": f.otras_categorias ? String(f.otras_categorias).trim() : "",
    // La columna de Airtable es de texto, así que se manda como texto y no
    // se depende de que typecast convierta el número.
    "Veces participado": f.veces_participado ? String(f.veces_participado).trim() : "",
    "Ediciones previas": f.ediciones_previas ? String(f.ediciones_previas).trim() : "",
    "Resultado previo": f.resultado_previo ? String(f.resultado_previo).trim() : "",
    "Observaciones": f.observaciones ? String(f.observaciones).trim() : "",
    "Acepta bases": !!f.acepta_bases,
    "Acepta RGPD": !!f.acepta_rgpd,
    "Estado": "Pendiente",
  };

  // ── 1 · Supabase, que es el registro principal ───────────────────────────
  const sbCab = SB_KEY
    ? { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "content-type": "application/json" }
    : null;
  let filaId = null;

  async function guardarEnSupabase(airtableId) {
    if (!sbCab) return null;
    const fila = {
      airtable_id: airtableId || null,
      especialidad: fields["Especialidad"],
      grupo: fields["Pareja/Equipo"] || null,
      n_integrantes: fields["Nº integrantes"],
      integrantes: fields["Integrantes"] || null,
      nombre: fields["Nombre"], apellidos: fields["Apellidos"],
      email: fields["Email"], telefono: fields["Teléfono"],
      pais: fields["País"], representa: fields["Representa a"] || null,
      ciudad: fields["Ciudad"] || null, nacimiento: fields["Fecha de nacimiento"],
      academia: fields["Academia"] || null, instagram: fields["Instagram"] || null,
      video: fields["Vídeo"],
      otras_categorias: fields["Otras categorías"] || null,
      veces_participado: fields["Veces participado"] || null,
      ediciones_previas: fields["Ediciones previas"] || null,
      resultado_previo: fields["Resultado previo"] || null,
      observaciones: fields["Observaciones"] || null,
      acepta_bases: fields["Acepta bases"], acepta_rgpd: fields["Acepta RGPD"],
      estado: "Pendiente",
      tiene_foto: !!body.photo?.base64, tiene_logo: !!body.logo?.base64,
    };
    try {
      const r = await fetch(`${SB_URL.replace(/\/$/, "")}/rest/v1/inscripciones`, {
        method: "POST",
        headers: { ...sbCab, Prefer: "return=representation" },
        body: JSON.stringify([fila]),
      });
      if (!r.ok) return null;
      const d = await r.json();
      return d?.[0]?.id ?? null;
    } catch { return null; }
  }

  // Sube un archivo al almacén de Supabase y devuelve su ruta.
  async function subirArchivo(archivo, nombre) {
    if (!sbCab || !archivo?.base64 || !filaId) return null;
    const ext = (archivo.type || "image/jpeg").split("/")[1].replace("jpeg", "jpg");
    const ruta = `${filaId}/${nombre}.${ext}`;
    try {
      const bin = Uint8Array.from(atob(archivo.base64), (c) => c.charCodeAt(0));
      const r = await fetch(`${SB_URL.replace(/\/$/, "")}/storage/v1/object/solicitudes/${ruta}`, {
        method: "POST",
        headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "content-type": archivo.type },
        body: bin,
      });
      return r.ok ? ruta : null;
    } catch { return null; }
  }

  filaId = await guardarEnSupabase(null);

  if (filaId) {
    const rutas = {};
    const fotoRuta = await subirArchivo(body.photo, "foto");
    const logoRuta = await subirArchivo(body.logo, "logotipo");
    if (fotoRuta) rutas.foto_ruta = fotoRuta;
    if (logoRuta) rutas.logo_ruta = logoRuta;
    if (Object.keys(rutas).length) {
      try {
        await fetch(`${SB_URL.replace(/\/$/, "")}/rest/v1/inscripciones?id=eq.${filaId}`, {
          method: "PATCH", headers: { ...sbCab, Prefer: "return=minimal" }, body: JSON.stringify(rutas),
        });
      } catch { /* la solicitud ya está guardada; las rutas son un extra */ }
    }
  }

  // ── 2 · Airtable, como copia de seguridad ────────────────────────────────
  let recId = null;
  if (TOKEN && BASE) {
    try {
      const res = await fetch(`https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}`, "content-type": "application/json" },
        body: JSON.stringify({ records: [{ fields }], typecast: true }),
      });
      if (res.ok) {
        const data = await res.json();
        recId = data.records?.[0]?.id ?? null;
        // Se anota la referencia cruzada para poder casar los dos sitios.
        if (recId && filaId && sbCab) {
          fetch(`${SB_URL.replace(/\/$/, "")}/rest/v1/inscripciones?id=eq.${filaId}`, {
            method: "PATCH", headers: { ...sbCab, Prefer: "return=minimal" },
            body: JSON.stringify({ airtable_id: recId }),
          }).catch(() => {});
        }
      }
    } catch { /* Airtable es la copia: que falle no tumba la solicitud */ }
  }

  // ── 3 · Los adjuntos en Airtable, si llegó a crearse el registro ─────────
  //    En Supabase ya están subidos arriba; esto es la copia.
  if (recId) {
    for (const [campo, archivo, nombre] of [
      ["Foto", body.photo, "foto.jpg"],
      ["Logotipo", body.logo, "logotipo.png"],
    ]) {
      if (!archivo?.base64 || !archivo?.type) continue;
      if (Math.floor((String(archivo.base64).length * 3) / 4) > 5 * 1024 * 1024) continue;
      try {
        await fetch(
          `https://content.airtable.com/v0/${BASE}/${recId}/${encodeURIComponent(campo)}/uploadAttachment`, {
            method: "POST",
            headers: { Authorization: `Bearer ${TOKEN}`, "content-type": "application/json" },
            body: JSON.stringify({
              contentType: archivo.type,
              filename: archivo.name || nombre,
              file: archivo.base64,
            }),
          });
      } catch { /* la copia no es crítica */ }
    }
  }

  // Solo se pierde si fallan los dos.
  if (!filaId && !recId) {
    return json({ error: "No se ha podido guardar la solicitud. Inténtalo en un momento." }, 502);
  }

  return json({ ok: true, recordId: recId, id: filaId });
};
