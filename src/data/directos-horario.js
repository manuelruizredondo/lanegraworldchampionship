// Horario de los directos, derivado de programa.js.
//
// Vive aparte porque lo usan dos sitios: la página de directos (que pinta una
// tarjeta por competición) y el Header (que solo necesita saber si ahora mismo
// hay emisión, para encender o apagar el punto rojo del menú).

import { PROGRAMA, NOMBRES, I18N as PROG_I18N } from "./programa.js";
import { COMPETICIONES, EMISIONES, ZONA } from "./directos.js";

const MESES = { ENE: 0, FEB: 1, MAR: 2, ABR: 3, MAY: 4, JUN: 5, JUL: 6, AGO: 7, SEP: 8, OCT: 9, NOV: 10, DIC: 11 };
const AMANECER = 6 * 60;
const ANIO = 2026;

const aMinutos = (hhmm) => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm).trim());
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

export const hhmm = (m) =>
  String(Math.floor(m / 60) % 24).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");

// "16:00 – 16:55" · "23:00 – 00:00" (termina pasada medianoche) · "01:30 – 06:00"
function tramo(txt) {
  const partes = String(txt).split(/\s*[–—-]\s*/);
  if (partes.length !== 2) return null;
  const ini = aMinutos(partes[0]);
  if (ini === null) return null;
  const finTxt = partes[1].trim();
  const fin = /amanecer|dawn|alba/i.test(finTxt) ? AMANECER : aMinutos(finTxt);
  if (fin === null) return null;
  return { ini, fin: fin <= ini ? fin + 1440 : fin };
}

// El programa mete las sesiones de madrugada en el bloque del día anterior: el
// 23 de octubre termina con "23:00 – 00:00", "00:00 – 00:50" y "01:30 – 06:00",
// y esas dos últimas son ya del 24. Hay que corregir la fecha o esas finales no
// se marcarían nunca como en directo.
//
// No vale con detectar cualquier retroceso de hora: ese mismo día, a un
// "Desde 09:30" le sigue un "09:00 – 12:00" y no hay cambio de día. El salto
// solo cuenta cuando se pasa de la noche cerrada a la madrugada.
function diasExtra(sessions) {
  let extra = 0, anterior = null;
  return sessions.map((s) => {
    const m = /(\d{1,2}:\d{2})/.exec(String(s.t));
    const ini = m ? aMinutos(m[1]) : null;
    if (ini !== null) {
      if (anterior !== null && ini < 7 * 60 && anterior >= 20 * 60) extra += 1;
      anterior = ini;
    }
    return extra;
  });
}

function competicionDe(nombre) {
  const disc = /^bachata\s*:/i.test(nombre) ? "bachata" : /^salsa\s*:/i.test(nombre) ? "salsa" : null;
  if (!disc) return null;
  return COMPETICIONES.find((c) => c.disciplina === disc && c.busca.test(nombre)) || null;
}

// Instante UTC real de una hora de pared de Calpe. No se puede dar por hecho
// un desfase fijo: el cambio de hora de octubre de 2026 cae el domingo 25, que
// es el último día del festival.
function instante(anio, mes, dia, minutos) {
  let t = Date.UTC(anio, mes, dia, Math.floor(minutos / 60), minutos % 60);
  // Dos pasadas bastan: la primera corrige el desfase, la segunda lo confirma
  // si la corrección cruzó el propio cambio de hora.
  for (let i = 0; i < 2; i++) {
    const p = {};
    new Intl.DateTimeFormat("en-CA", {
      timeZone: ZONA, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hour12: false,
    }).formatToParts(new Date(t)).forEach((x) => { p[x.type] = x.value; });
    const comoSeVe = Date.UTC(+p.year, +p.month - 1, +p.day,
                              +(p.hour === "24" ? 0 : p.hour), +p.minute);
    const deseado = Date.UTC(anio, mes, dia, Math.floor(minutos / 60), minutos % 60);
    const desvio = comoSeVe - deseado;
    if (desvio === 0) break;
    t -= desvio;
  }
  return t;
}

// ── Sesiones de competición, ya repartidas y fechadas ────────────────────
// `lang` solo afecta a los textos; las fechas y horas son las mismas.
export function horarioPorCompeticion(lang = "es") {
  const tp = PROG_I18N[lang] || PROG_I18N.es;
  const traduce = (n) => (lang === "es" ? n : (NOMBRES[lang] && NOMBRES[lang][n]) || n);

  // Etiqueta corta de cada día ("Mié 21", "Sat 24", "Sab 24").
  const DIAS = {};
  PROGRAMA.forEach((d) => {
    const f = /^(\d{1,2})/.exec(d.date);
    if (!f) return;
    DIAS[Number(f[1])] = `${((tp.days && tp.days[d.day]) || d.day).slice(0, 3)} ${f[1]}`;
  });

  const porComp = {};
  COMPETICIONES.forEach((c) => { porComp[c.clave] = []; });
  const huerfanas = [], sinHora = [];

  PROGRAMA.forEach((d) => {
    const f = /^(\d{1,2})\s*([A-ZÁÉÍÓÚ]{3})/i.exec(d.date);
    if (!f) return;
    const extras = diasExtra(d.sessions);

    d.sessions.forEach((s, i) => {
      if (s.k !== "comp") return;
      const c = competicionDe(s.n);
      if (!c) { huerfanas.push(`${d.date} · ${s.n}`); return; }
      const r = tramo(s.t);
      if (!r) { sinHora.push(`${d.date} · ${s.t} · ${s.n}`); return; }

      const mes = MESES[f[2].toUpperCase()];
      const real = new Date(Date.UTC(ANIO, mes, Number(f[1]) + extras[i]));
      const dia = real.getUTCDate();
      porComp[c.clave].push({
        dia, mes: real.getUTCMonth(),
        ini: r.ini, fin: r.fin, r: s.r, n: traduce(s.n),
        etiqueta: DIAS[dia] || String(dia),
        hora: `${hhmm(r.ini)} – ${hhmm(r.fin)}`,
        horaIni: hhmm(r.ini),
        sala: (tp.rooms && tp.rooms[s.r]) || s.r,
        desde: instante(ANIO, real.getUTCMonth(), dia, r.ini),
        hasta: instante(ANIO, real.getUTCMonth(), dia, r.fin),
      });
    });
  });

  // Si el programa cambia y aparece una modalidad nueva o un horario con otro
  // formato, que se vea en el build y no en el escenario el día 21.
  if (huerfanas.length) {
    throw new Error(
      "Directos: hay sesiones de competición que no encajan en ninguna de las " +
      "once competiciones de directos.js. Añade su modalidad a COMPETICIONES:\n  " +
      huerfanas.join("\n  ")
    );
  }
  if (sinHora.length) {
    throw new Error(
      "Directos: hay sesiones de competición cuyo horario no se entiende. " +
      "Hace falta 'HH:MM – HH:MM':\n  " + sinHora.join("\n  ")
    );
  }

  COMPETICIONES.forEach((c) => {
    porComp[c.clave].sort((a, b) => a.mes - b.mes || a.dia - b.dia || a.ini - b.ini);
  });
  return porComp;
}

// ── Ventanas de emisión, para el punto del menú ──────────────────────────
// Pares [desde, hasta] en milisegundos UTC, fundidos cuando se solapan.
//
// Solo entran las salas que tengan enlace configurado en EMISIONES: si aún no
// hay directo que ver, el punto del menú no se enciende aunque haya una
// competición en el escenario.
export function ventanasDirecto() {
  const porComp = horarioPorCompeticion("es");
  const todas = [];
  Object.keys(porComp).forEach((k) => {
    porComp[k].forEach((s) => {
      const em = EMISIONES[s.r];
      if (em && em.fuente) todas.push([s.desde, s.hasta]);
    });
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
