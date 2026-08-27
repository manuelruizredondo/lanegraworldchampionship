// Panel de admin: lista las inscripciones guardadas en Airtable.
// Netlify Function (v2). Endpoint: /.netlify/functions/inscripciones-listar
//
// Usa las mismas variables de entorno que la inscripción:
//   ADMIN_PASSWORD (si no existe, se usa INSCRIPCION_PASSWORD)
//   AIRTABLE_TOKEN · AIRTABLE_BASE_ID · AIRTABLE_TABLE
//
// Acciones (POST, JSON):
//   { action: "list",  password }                  → todas las inscripciones
//   { action: "estado", password, id, estado }     → cambia el Estado de una

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });

const ESTADOS = ["Pendiente", "Aprobado", "Rechazado"];

// Actualiza campos de un registro de Airtable
async function patch(api, auth, id, fields) {
  try {
    const res = await fetch(api, {
      method: "PATCH",
      headers: { ...auth, "content-type": "application/json" },
      body: JSON.stringify({ records: [{ id, fields }], typecast: true }),
    });
    if (!res.ok) return json({ error: "Airtable rechazó el cambio.", detail: await res.text() }, 502);
    return json({ ok: true });
  } catch (e) {
    return json({ error: "Error de conexión con Airtable.", detail: String(e) }, 502);
  }
}

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  const PASS = process.env.ADMIN_PASSWORD || process.env.INSCRIPCION_PASSWORD;
  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE = process.env.AIRTABLE_BASE_ID;
  const TABLE = process.env.AIRTABLE_TABLE || "Inscripciones";

  let body;
  try { body = await req.json(); } catch { return json({ error: "JSON inválido" }, 400); }

  if (!PASS) return json({ error: "Servidor sin configurar (falta ADMIN_PASSWORD)." }, 500);
  if (!body || body.password !== PASS) return json({ error: "Contraseña incorrecta." }, 401);
  if (!TOKEN || !BASE) return json({ error: "Servidor sin configurar (faltan claves de Airtable)." }, 500);

  const api = `https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}`;
  const auth = { Authorization: `Bearer ${TOKEN}` };

  // --- Cambiar el estado de una inscripción ---
  if (body.action === "estado") {
    if (!body.id || !ESTADOS.includes(body.estado)) return json({ error: "Datos no válidos." }, 400);
    return patch(api, auth, body.id, { Estado: body.estado });
  }

  // --- Guardar las notas internas de la organización ---
  if (body.action === "notas") {
    if (!body.id) return json({ error: "Falta el identificador." }, 400);
    return patch(api, auth, body.id, { "Notas": String(body.notas ?? "").slice(0, 5000) });
  }

  // --- Listar (paginando hasta agotar) ---
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

    const items = records.map((r) => {
      const f = r.fields || {};
      const foto = Array.isArray(f.Foto) && f.Foto[0]
        ? (f.Foto[0].thumbnails?.large?.url || f.Foto[0].url)
        : "";
      return {
        id: r.id,
        creado: r.createdTime,
        nombre: [f.Nombre, f.Apellidos].filter(Boolean).join(" "),
        especialidad: f.Especialidad || "",
        grupo: f["Pareja/Equipo"] || "",
        n: f["Nº integrantes"] || 1,
        integrantes: f.Integrantes || "",
        pais: f["País"] || "",
        ciudad: f.Ciudad || "",
        email: f.Email || "",
        telefono: f["Teléfono"] || "",
        academia: f.Academia || "",
        video: f["Vídeo"] || "",
        instagram: f.Instagram || "",
        observaciones: f.Observaciones || "",
        notas: f.Notas || "",
        estado: f.Estado || "Pendiente",
        foto,
      };
    }).sort((a, b) => String(b.creado).localeCompare(String(a.creado)));

    // Resumen por categoría y por estado
    const porCategoria = {}, porEstado = {};
    let personas = 0;
    for (const it of items) {
      porCategoria[it.especialidad || "(sin categoría)"] = (porCategoria[it.especialidad || "(sin categoría)"] || 0) + 1;
      porEstado[it.estado] = (porEstado[it.estado] || 0) + 1;
      personas += Number(it.n) || 1;
    }

    return json({ ok: true, total: items.length, personas, porCategoria, porEstado, items });
  } catch (e) {
    return json({ error: "Error de conexión con Airtable.", detail: String(e) }, 502);
  }
};
