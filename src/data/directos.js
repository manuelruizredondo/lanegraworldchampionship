// Emisiones en directo del festival, organizadas POR COMPETICIÓN.
//
// Hay una pantalla por cada una de las 11 competiciones del Mundial, no por
// sala. Cada pantalla se enciende cuando esa competición está en el escenario,
// leyendo el horario de programa.js.
//
// ── Lo que hay que rellenar ───────────────────────────────────────────────
//
// 1) EMISIONES: las cámaras son físicas y están en las salas, así que el
//    enlace del directo se configura por sala. Una competición reproduce el
//    enlace de la sala en la que esté compitiendo en ese momento.
//
//      tipo: "youtube"  → `fuente` es el ID del vídeo o de la emisión
//                         (lo que va detrás de ?v= o de youtu.be/)
//      tipo: "iframe"   → `fuente` es la URL completa que dé el proveedor
//
//    Mientras `fuente` esté vacío la pantalla sale en modo «aún no
//    disponible» y la página sigue funcionando: se puede publicar antes de
//    tener los enlaces.
//
// 2) `portada` de cada competición: el cartel que diseñe el diseñador
//    (pieza C de la hoja de trabajo de rótulos). Mientras sea null se pinta
//    un fondo con el nombre, así que tampoco bloquea.

export const EMISIONES = {
  gs: { tipo: "youtube", fuente: "" },   // Gran Salón del Mundial
  pb: { tipo: "youtube", fuente: "" },   // Piano Bar
};

// Las 11 competiciones, en el orden en que se presentan.
//
// `busca` es cómo se reconoce una sesión de programa.js: tiene que casar la
// disciplina y la modalidad. Los nombres del programa usan «Chicas/Chicos»
// y «Dúos Mixtos», de ahí las expresiones. Ojo al orden de los términos:
// «Dúos Chicas» y «Solistas Chicas» comparten palabra, por eso se busca la
// modalidad entera y no solo el género.
export const COMPETICIONES = [
  { clave: "bachata-solista-femenino",  disciplina: "bachata", busca: /Solistas Chicas/i,  portada: null },
  { clave: "bachata-solista-masculino", disciplina: "bachata", busca: /Solistas Chicos/i,  portada: null },
  { clave: "bachata-duos",              disciplina: "bachata", busca: /Dúos Mixtos/i,      portada: null },
  { clave: "bachata-parejas",           disciplina: "bachata", busca: /Parejas/i,          portada: null },
  { clave: "bachata-equipos",           disciplina: "bachata", busca: /Equipos/i,          portada: null },
  { clave: "salsa-solista-femenino",    disciplina: "salsa",   busca: /Solistas Chicas/i,  portada: null },
  { clave: "salsa-solista-masculino",   disciplina: "salsa",   busca: /Solistas Chicos/i,  portada: null },
  { clave: "salsa-duos-femeninos",      disciplina: "salsa",   busca: /Dúos Chicas/i,      portada: null },
  { clave: "salsa-duos-masculinos",     disciplina: "salsa",   busca: /Dúos Chicos/i,      portada: null },
  { clave: "salsa-parejas",             disciplina: "salsa",   busca: /Parejas/i,          portada: null },
  { clave: "salsa-equipos",             disciplina: "salsa",   busca: /Equipos/i,          portada: null },
];

export const NOMBRES_COMP = {
  es: {
    "bachata-solista-femenino": "Bachata · Solista Femenino",
    "bachata-solista-masculino": "Bachata · Solista Masculino",
    "bachata-duos": "Bachata · Dúos",
    "bachata-parejas": "Bachata · Parejas",
    "bachata-equipos": "Bachata · Equipos",
    "salsa-solista-femenino": "Salsa · Solista Femenino",
    "salsa-solista-masculino": "Salsa · Solista Masculino",
    "salsa-duos-femeninos": "Salsa · Dúos Femeninos",
    "salsa-duos-masculinos": "Salsa · Dúos Masculinos",
    "salsa-parejas": "Salsa · Parejas",
    "salsa-equipos": "Salsa · Equipos",
  },
  en: {
    "bachata-solista-femenino": "Bachata · Female Solo",
    "bachata-solista-masculino": "Bachata · Male Solo",
    "bachata-duos": "Bachata · Duos",
    "bachata-parejas": "Bachata · Couples",
    "bachata-equipos": "Bachata · Teams",
    "salsa-solista-femenino": "Salsa · Female Solo",
    "salsa-solista-masculino": "Salsa · Male Solo",
    "salsa-duos-femeninos": "Salsa · Female Duos",
    "salsa-duos-masculinos": "Salsa · Male Duos",
    "salsa-parejas": "Salsa · Couples",
    "salsa-equipos": "Salsa · Teams",
  },
  it: {
    "bachata-solista-femenino": "Bachata · Solista Femminile",
    "bachata-solista-masculino": "Bachata · Solista Maschile",
    "bachata-duos": "Bachata · Duo",
    "bachata-parejas": "Bachata · Coppie",
    "bachata-equipos": "Bachata · Team",
    "salsa-solista-femenino": "Salsa · Solista Femminile",
    "salsa-solista-masculino": "Salsa · Solista Maschile",
    "salsa-duos-femeninos": "Salsa · Duo Femminili",
    "salsa-duos-masculinos": "Salsa · Duo Maschili",
    "salsa-parejas": "Salsa · Coppie",
    "salsa-equipos": "Salsa · Team",
  },
};

// El festival se celebra en España: lo que está «en directo ahora» se calcula
// siempre en hora de Madrid, no en la del dispositivo de quien mira. Si no,
// alguien en México vería la competición equivocada marcada como activa.
export const ZONA = "Europe/Madrid";

export const I18N = {
  es: {
    ruta: "/en-directo/",
    metaTitle: "En directo · La Negra Dance Festival",
    metaDesc: "Sigue en directo el XV Mundial de Pasos Libres desde Calpe: las once competiciones emitiendo en vivo, del 21 al 25 de octubre de 2026.",
    eyebrow: "Mundial de Pasos Libres · 2026",
    h1: "En directo",
    lead: "Las once competiciones del Mundial, en vivo desde Calpe. Cada pantalla se enciende sola cuando esa competición sale al escenario.",
    menu: "EN DIRECTO",
    directo: "EN DIRECTO",
    luego: "A continuación",
    sinEmision: "No está compitiendo ahora mismo.",
    sinEnlace: "El directo se activará durante el festival.",
    verAhora: "Ver en directo",
    cargando: "Un momento…",
    activas: (n) => (n === 1 ? "1 competición en directo" : n + " competiciones en directo"),
    ningunaActiva: "Ahora mismo no hay ninguna competición en el escenario.",
    antesDelFestival: "El directo empieza el miércoles 21 de octubre.",
    despuesDelFestival: "El festival ha terminado. Los vídeos se publicarán en los próximos días.",
    proximo: "Empieza a las",
    terminada: "Terminada",
    enSala: "en",
    verPrograma: "Ver la programación completa",
    horaLocal: "Horario de Calpe (España)",
    avisoDatos: "El directo consume bastantes datos. Si estás fuera de casa, mejor con wifi.",
  },
  en: {
    ruta: "/en/live/",
    metaTitle: "Live · La Negra Dance Festival",
    metaDesc: "Watch the XV Pasos Libres World Championship live from Calpe: all eleven competitions streaming, 21–25 October 2026.",
    eyebrow: "Pasos Libres World Championship · 2026",
    h1: "Live",
    lead: "The championship's eleven competitions, live from Calpe. Each screen switches itself on when that competition takes the stage.",
    menu: "LIVE",
    directo: "LIVE",
    luego: "Up next",
    sinEmision: "Not competing right now.",
    sinEnlace: "The stream goes live during the festival.",
    verAhora: "Watch live",
    cargando: "One moment…",
    activas: (n) => (n === 1 ? "1 competition live" : n + " competitions live"),
    ningunaActiva: "No competition is on stage right now.",
    antesDelFestival: "The stream starts on Wednesday 21 October.",
    despuesDelFestival: "The festival is over. Videos will go up over the next few days.",
    proximo: "Starts at",
    terminada: "Finished",
    enSala: "in",
    verPrograma: "See the full programme",
    horaLocal: "Calpe time (Spain)",
    avisoDatos: "Live video uses a lot of data. On the move, wifi is a better idea.",
  },
  it: {
    ruta: "/it/in-diretta/",
    metaTitle: "In diretta · La Negra Dance Festival",
    metaDesc: "Segui in diretta il XV Mondiale Pasos Libres da Calpe: le undici competizioni in streaming, dal 21 al 25 ottobre 2026.",
    eyebrow: "Mondiale Pasos Libres · 2026",
    h1: "In diretta",
    lead: "Le undici competizioni del Mondiale, in diretta da Calpe. Ogni schermo si accende da solo quando quella competizione sale sul palco.",
    menu: "IN DIRETTA",
    directo: "IN DIRETTA",
    luego: "A seguire",
    sinEmision: "Non è in gara in questo momento.",
    sinEnlace: "La diretta si attiverà durante il festival.",
    verAhora: "Guarda in diretta",
    cargando: "Un momento…",
    activas: (n) => (n === 1 ? "1 competizione in diretta" : n + " competizioni in diretta"),
    ningunaActiva: "In questo momento nessuna competizione è sul palco.",
    antesDelFestival: "La diretta inizia mercoledì 21 ottobre.",
    despuesDelFestival: "Il festival è finito. I video saranno pubblicati nei prossimi giorni.",
    proximo: "Inizia alle",
    terminada: "Conclusa",
    enSala: "in",
    verPrograma: "Vedi il programma completo",
    horaLocal: "Orario di Calpe (Spagna)",
    avisoDatos: "La diretta consuma parecchi dati. Fuori casa, meglio con il wifi.",
  },
};
