// Vuelca la programación ya traducida a los tres idiomas, para que el script
// que dibuja el PDF (scripts/programa-pdf.py) no tenga que saber de i18n.
//
//   node scripts/programa-datos.mjs /tmp/programa.json
//
import { writeFileSync } from "node:fs";
import { PROGRAMA, I18N, NOMBRES } from "../src/data/programa.js";

const ETIQUETAS = {
  es: {
    master: "MASTERCLASS",
    ciclo: "PONENCIA",
    bachata: "MUNDIAL BACHATA",
    salsa: "MUNDIAL SALSA",
    salas: { gs: "GRAN SALÓN DEL MUNDIAL", pb: "SALA PIANO BAR", s1: "SALA 1", s2: "SALA 2" },
    cabecera: "LA NEGRA WORLD CHAMPIONSHIP · CALPE, 21-25 OCTUBRE 2026",
    leyenda: "NIVELES",
    pag: "pág.",
    cont: "cont.",
  },
  en: {
    master: "MASTERCLASS",
    ciclo: "TALK",
    bachata: "BACHATA CHAMPIONSHIP",
    salsa: "SALSA CHAMPIONSHIP",
    salas: { gs: "MAIN HALL", pb: "PIANO BAR", s1: "ROOM 1", s2: "ROOM 2" },
    cabecera: "LA NEGRA WORLD CHAMPIONSHIP · CALPE, SPAIN, 21-25 OCTOBER 2026",
    leyenda: "LEVELS",
    pag: "p.",
    cont: "cont.",
  },
  it: {
    master: "MASTERCLASS",
    ciclo: "CONFERENZA",
    bachata: "MONDIALE BACHATA",
    salsa: "MONDIALE SALSA",
    salas: { gs: "SALONE DEL MONDIALE", pb: "SALA PIANO BAR", s1: "SALA 1", s2: "SALA 2" },
    cabecera: "LA NEGRA WORLD CHAMPIONSHIP · CALPE, 21-25 OTTOBRE 2026",
    leyenda: "LIVELLI",
    pag: "pag.",
    cont: "segue",
  },
};

const salida = {};
for (const lang of ["es", "en", "it"]) {
  const t = I18N[lang];
  const NOM = NOMBRES[lang] || {};
  salida[lang] = {
    etiquetas: { ...ETIQUETAS[lang], kind_social: t.kind.social, kind_meal: t.kind.meal },
    note: t.note,
    niveles: t.levels,
    dias: PROGRAMA.map((d) => ({
      day: t.days[d.day] || d.day,
      date: d.date,
      sessions: d.sessions.map((s) => ({
        ...s,
        // `clave` guarda el nombre en español: es la llave de colores-drive.json
        clave: s.n,
        n: s.r === "full" ? (t.band[s.n] || s.n) : (NOM[s.n] || s.n),
        t: (s.t || "").replace(/^Desde\b/, t.desde),
        l: s.l ? (t.levels[s.l] || s.l) : undefined,
        lClave: s.l,
      })),
    })),
  };
}

const destino = process.argv[2] || "/tmp/programa.json";
writeFileSync(destino, JSON.stringify(salida));
console.log(`datos escritos en ${destino} (es/en/it)`);
