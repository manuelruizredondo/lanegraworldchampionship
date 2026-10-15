// Horario de los directos, derivado de la parrilla de emisión de directos.js.
//
// Vive aparte porque lo usan dos sitios: la página de directos (que pinta una
// tarjeta por competición) y el Header (que solo necesita saber si ahora mismo
// hay emisión, para encender o apagar el punto rojo del menú y el botón del
// hero de la home).
//
// Ojo: la fuente aquí es PARRILLA, el plan de producción, no programa.js. Son
// cosas distintas a propósito: el festival tiene más competiciones y más
// horas de las que se emiten.

import { PARRILLA, COMPETICIONES, EMISIONES, TITULOS, ZONA, ANIO, MES } from "./directos.js";
import { I18N as PROG_I18N } from "./programa.js";

const DIAS_SEMANA = { 21: "Miércoles", 22: "Jueves", 23: "Viernes", 24: "Sábado", 25: "Domingo", 26: "Domingo" };

const aMinutos = (hhmm) => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm).trim());
  if (!m) throw new Error("Directos: hora mal escrita en la parrilla: " + hhmm);
  return Number(m[1]) * 60 + Number(m[2]);
};

export const hhmm = (m) =>
  String(Math.floor(m / 60) % 24).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");

// Instante UTC real de una hora de pared de Calpe. No se puede dar por hecho
// un desfase fijo: el cambio de hora de octubre de 2026 cae el domingo 25, que
// es justo la última jornada que se emite.
function instante(dia, minutos) {
  const hora = Math.floor(minutos / 60), min = minutos % 60;
  let t = Date.UTC(ANIO, MES, dia, hora, min);
  // Dos pasadas bastan: la primera corrige el desfase, la segunda lo confirma
  // si la corrección cruzó el propio cambio de hora.
  for (let i = 0; i < 2; i++) {
    const p = {};
    new Intl.DateTimeFormat("en-CA", {
      timeZone: ZONA, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hour12: false,
    }).formatToParts(new Date(t)).forEach((x) => { p[x.type] = x.value; });
    const desvio = Date.UTC(+p.year, +p.month - 1, +p.day,
                            +(p.hour === "24" ? 0 : p.hour), +p.minute)
                 - Date.UTC(ANIO, MES, dia, hora, min);
    if (desvio === 0) break;
    t -= desvio;
  }
  return t;
}

// ── Pases de emisión, repartidos por competición ─────────────────────────
export function horarioPorCompeticion(lang = "es") {
  const tp = PROG_I18N[lang] || PROG_I18N.es;
  const titulo = (s) => (lang === "es" ? s : (TITULOS[lang] && TITULOS[lang][s]) || s);
  const dia = (n) => {
    const nombre = (tp.days && tp.days[DIAS_SEMANA[n]]) || DIAS_SEMANA[n] || "";
    return `${nombre.slice(0, 3)} ${n}`;
  };

  const claves = COMPETICIONES.map((c) => c.clave);
  const porComp = {};
  claves.forEach((k) => { porComp[k] = []; });

  const desconocidas = [];
  PARRILLA.forEach((p) => {
    if (claves.indexOf(p.comp) === -1) { desconocidas.push(p.comp); return; }
    const ini = aMinutos(p.ini);
    let fin = aMinutos(p.fin);
    if (fin <= ini) fin += 1440;               // el pase cruza la medianoche
    const em = (p.fuente ? { tipo: p.tipo || "vimeo", fuente: p.fuente } : EMISIONES[p.dia]) || null;

    porComp[p.comp].push({
      dia: p.dia, ini, fin,
      n: titulo(p.titulo),
      etiqueta: dia(p.dia),
      hora: `${hhmm(ini)} – ${hhmm(fin)}`,
      horaIni: hhmm(ini),
      emision: em && em.fuente ? em : null,
      desde: instante(p.dia, ini),
      hasta: instante(p.dia, fin),
    });
  });

  // Que un error de tecleo en la parrilla se vea en el build y no el día 23.
  if (desconocidas.length) {
    throw new Error(
      "Directos: la parrilla apunta a competiciones que no existen en " +
      "COMPETICIONES: " + Array.from(new Set(desconocidas)).join(", ")
    );
  }
  const vacias = claves.filter((k) => porComp[k].length === 0);
  if (vacias.length) {
    throw new Error(
      "Directos: estas competiciones no tienen ningún pase en la parrilla, así " +
      "que su pantalla nunca se encendería: " + vacias.join(", ")
    );
  }

  claves.forEach((k) => porComp[k].sort((a, b) => a.dia - b.dia || a.ini - b.ini));
  return porComp;
}

// ── Ventanas de emisión, para el testigo del menú y el botón del hero ────
// Pares [desde, hasta] en milisegundos UTC, fundidos cuando se solapan.
//
// Solo entran los pases con enlace configurado: si aún no hay directo que ver,
// el testigo no se enciende aunque la competición esté en el escenario.
export function ventanasDirecto() {
  const porComp = horarioPorCompeticion("es");
  const todas = [];
  Object.keys(porComp).forEach((k) => {
    porComp[k].forEach((s) => { if (s.emision) todas.push([s.desde, s.hasta]); });
  });
  todas.sort((a, b) => a[0] - b[0]);

  const fundidas = [];
  todas.forEach((v) => {
    const ultima = fundidas[fundidas.length - 1];
    if (ultima && v[0] <= ultima[1]) ultima[1] = Math.max(ultima[1], v[1]);
    else fundidas.push([v[0], v[1]]);
  });
  return fundidas;
}
