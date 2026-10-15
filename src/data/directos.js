// Emisiones en directo del Mundial, organizadas POR COMPETICIÓN.
//
// ── Importante ───────────────────────────────────────────────────────────
// La parrilla de abajo NO sale de programa.js: sale del plan de producción
// presupuestado, que es el que manda sobre qué se emite y a qué hora. Solo se
// emiten TRES jornadas —viernes 23, sábado 24 y domingo 25— y algunos horarios
// no coinciden con los de la programación del festival.
//
// Si cambia el plan de producción, se cambia aquí y la página se ajusta sola.
//
// ── Lo que hay que rellenar ──────────────────────────────────────────────
// `fuente` de cada jornada en EMISIONES. Mientras esté vacío, la pantalla sale
// en modo «aún no disponible», el testigo rojo del menú no se enciende y el
// botón del hero de la home no aparece. Es decir: se puede publicar ya.
//
//   tipo: "vimeo"   → `fuente` es el ID numérico del vídeo de Vimeo
//   tipo: "iframe"  → `fuente` es la URL completa del reproductor
//
// Cada jornada lleva su propia producción (un especialista de streaming, un
// operador de cámara y una cámara fija), así que el enlace se configura por
// día. Si un pase concreto tiene un iframe distinto, se le pueden poner
// `fuente` y `tipo` propios en su línea de la parrilla y mandan sobre el día.

export const EMISIONES = {
  23: { tipo: "vimeo", fuente: "" },   // Viernes 23
  24: { tipo: "vimeo", fuente: "" },   // Sábado 24
  25: { tipo: "vimeo", fuente: "" },   // Domingo 25
};

// ── Parrilla de emisión ──────────────────────────────────────────────────
// `dia` es el día de octubre REAL del pase: los dos que empiezan pasada la
// medianoche del viernes y del sábado van fechados en el día siguiente, que es
// cuando ocurren de verdad.
//
// `fin` marcado con «inferido»: el plan de producción solo daba la hora de
// comienzo y se ha cerrado con la duración que da la programación del
// festival. Conviene confirmarlos con realización.
export const PARRILLA = [
  // VIERNES 23
  { dia: 23, ini: "13:00", fin: "14:50", comp: "bachata-solista-femenino",  titulo: "Semifinal Solistas Chicas" },   // fin inferido (dos pases: 13:00 y 14:00)
  { dia: 23, ini: "16:00", fin: "17:50", comp: "salsa-solista-femenino",    titulo: "Semifinal Solistas Chicas" },   // fin inferido (dos pases: 16:00 y 17:00)
  { dia: 23, ini: "18:00", fin: "18:45", comp: "bachata-solista-masculino", titulo: "Final Solistas Chicos" },
  { dia: 23, ini: "19:00", fin: "19:50", comp: "bachata-solista-femenino",  titulo: "Final Solistas Chicas" },  // fin inferido
  { dia: 23, ini: "22:00", fin: "23:00", comp: "salsa-duos-femeninos",      titulo: "Gran Final Dúos Chicas" },
  // El plan ponía "23:00 a 00:30", que se solapaba con el pase siguiente de
  // las 00:00. Se cierra a las 00:00, como en la programación del festival.
  { dia: 23, ini: "23:00", fin: "00:00", comp: "salsa-duos-masculinos",     titulo: "Gran Final Dúos Chicos" },
  { dia: 24, ini: "00:00", fin: "00:55", comp: "salsa-solista-femenino",    titulo: "Gran Final Solistas Chicas" },

  // SÁBADO 24
  { dia: 24, ini: "12:00", fin: "13:50", comp: "salsa-solista-masculino",   titulo: "Semifinal Solistas Chicos" },   // fin inferido (dos pases: 12:00 y 13:00)
  { dia: 24, ini: "16:00", fin: "17:50", comp: "bachata-duos",              titulo: "Semifinal Dúos Mixtos" },       // fin inferido (dos pases: 16:00 y 17:00)
  { dia: 24, ini: "18:00", fin: "19:50", comp: "salsa-parejas",             titulo: "Semifinal Parejas" },           // fin inferido (dos pases: 18:00 y 19:00)
  { dia: 24, ini: "20:00", fin: "21:00", comp: "salsa-solista-masculino",   titulo: "Gran Final Solistas Chicos" },
  { dia: 24, ini: "23:00", fin: "00:55", comp: "salsa-equipos",             titulo: "Gran Final Equipos" },

  // DOMINGO 25
  { dia: 25, ini: "13:00", fin: "14:50", comp: "bachata-parejas",           titulo: "Gran Final Parejas" },
  { dia: 25, ini: "17:00", fin: "18:00", comp: "bachata-duos",              titulo: "Gran Final Dúos Mixtos" },
  { dia: 25, ini: "18:00", fin: "19:00", comp: "salsa-parejas",             titulo: "Gran Final Parejas" },
  { dia: 25, ini: "19:00", fin: "21:00", comp: "bachata-equipos",           titulo: "Gran Final Equipos" },
];

// Las once competiciones. El orden en que se presentan en la página lo decide
// la parrilla, no esta lista.
export const COMPETICIONES = [
  { clave: "bachata-solista-femenino",  disciplina: "bachata", portada: null },
  { clave: "bachata-solista-masculino", disciplina: "bachata", portada: null },
  { clave: "bachata-duos",              disciplina: "bachata", portada: null },
  { clave: "bachata-parejas",           disciplina: "bachata", portada: null },
  { clave: "bachata-equipos",           disciplina: "bachata", portada: null },
  { clave: "salsa-solista-femenino",    disciplina: "salsa",   portada: null },
  { clave: "salsa-solista-masculino",   disciplina: "salsa",   portada: null },
  { clave: "salsa-duos-femeninos",      disciplina: "salsa",   portada: null },
  { clave: "salsa-duos-masculinos",     disciplina: "salsa",   portada: null },
  { clave: "salsa-parejas",             disciplina: "salsa",   portada: null },
  { clave: "salsa-equipos",             disciplina: "salsa",   portada: null },
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

// Títulos de los pases, para las versiones en inglés e italiano.
export const TITULOS = {
  en: {
    "Semifinal Solistas Chicas": "Women's Solo Semifinal",
    "Semifinal Solistas Chicos": "Men's Solo Semifinal",
    "Gran Final Solistas Chicas": "Women's Solo Grand Final",
    "Final Solistas Chicos": "Men's Solo Final",
    "Final Solistas Chicas": "Women's Solo Final",
    "Gran Final Solistas Chicos": "Men's Solo Grand Final",
    "Gran Final Dúos Chicas": "Women's Duos Grand Final",
    "Gran Final Dúos Chicos": "Men's Duos Grand Final",
    "Semifinal Dúos Mixtos": "Mixed Duos Semifinal",
    "Gran Final Dúos Mixtos": "Mixed Duos Grand Final",
    "Semifinal Parejas": "Couples Semifinal",
    "Gran Final Parejas": "Couples Grand Final",
    "Gran Final Equipos": "Teams Grand Final",
  },
  it: {
    "Semifinal Solistas Chicas": "Semifinale Soliste Donne",
    "Semifinal Solistas Chicos": "Semifinale Solisti Uomini",
    "Gran Final Solistas Chicas": "Gran Finale Soliste Donne",
    "Final Solistas Chicos": "Finale Solisti Uomini",
    "Final Solistas Chicas": "Finale Soliste Donne",
    "Gran Final Solistas Chicos": "Gran Finale Solisti Uomini",
    "Gran Final Dúos Chicas": "Gran Finale Duo Donne",
    "Gran Final Dúos Chicos": "Gran Finale Duo Uomini",
    "Semifinal Dúos Mixtos": "Semifinale Duo Misti",
    "Gran Final Dúos Mixtos": "Gran Finale Duo Misti",
    "Semifinal Parejas": "Semifinale Coppie",
    "Gran Final Parejas": "Gran Finale Coppie",
    "Gran Final Equipos": "Gran Finale Team",
  },
};

// El festival se celebra en España: lo que está «en directo ahora» se calcula
// siempre en hora de Madrid, no en la del dispositivo de quien mira.
export const ZONA = "Europe/Madrid";
export const ANIO = 2026;
export const MES = 9; // octubre

export const I18N = {
  es: {
    ruta: "/en-directo/",
    metaTitle: "En directo · La Negra Dance Festival",
    metaDesc: "Sigue en directo el XV Mundial de Pasos Libres desde Calpe: las semifinales y grandes finales, del 23 al 25 de octubre de 2026.",
    eyebrow: "Mundial de Pasos Libres · 2026",
    h1: "En directo",
    lead: "Las semifinales y las grandes finales del Mundial, en vivo desde Calpe. Cada pantalla se enciende sola cuando esa competición sale al escenario.",
    jornadas: "Se emiten las jornadas del viernes 23, el sábado 24 y el domingo 25.",
    menu: "EN DIRECTO",
    directo: "EN DIRECTO",
    luego: "A continuación",
    sinEnlace: "El directo se activará durante el festival.",
    verAhora: "Ver en directo",
    cargando: "Un momento…",
    activas: (n) => (n === 1 ? "1 competición en directo" : n + " competiciones en directo"),
    ningunaActiva: "Ahora mismo no hay ninguna competición en el escenario.",
    antesDelFestival: "El directo empieza el viernes 23 de octubre.",
    despuesDelFestival: "El Mundial ha terminado. Los vídeos se publicarán en los próximos días.",
    proximo: "Empieza a las",
    terminada: "Terminada",
    verPrograma: "Ver la programación completa",
    horaLocal: "Horario de Calpe (España)",
    avisoDatos: "El directo consume bastantes datos. Si estás fuera de casa, mejor con wifi.",
  },
  en: {
    ruta: "/en/live/",
    metaTitle: "Live · La Negra Dance Festival",
    metaDesc: "Watch the XV Pasos Libres World Championship live from Calpe: semifinals and grand finals, 23–25 October 2026.",
    eyebrow: "Pasos Libres World Championship · 2026",
    h1: "Live",
    lead: "The championship's semifinals and grand finals, live from Calpe. Each screen switches itself on when that competition takes the stage.",
    jornadas: "Friday 23, Saturday 24 and Sunday 25 are broadcast.",
    menu: "LIVE",
    directo: "LIVE",
    luego: "Up next",
    sinEnlace: "The stream goes live during the festival.",
    verAhora: "Watch live",
    cargando: "One moment…",
    activas: (n) => (n === 1 ? "1 competition live" : n + " competitions live"),
    ningunaActiva: "No competition is on stage right now.",
    antesDelFestival: "The stream starts on Friday 23 October.",
    despuesDelFestival: "The championship is over. Videos will go up over the next few days.",
    proximo: "Starts at",
    terminada: "Finished",
    verPrograma: "See the full programme",
    horaLocal: "Calpe time (Spain)",
    avisoDatos: "Live video uses a lot of data. On the move, wifi is a better idea.",
  },
  it: {
    ruta: "/it/in-diretta/",
    metaTitle: "In diretta · La Negra Dance Festival",
    metaDesc: "Segui in diretta il XV Mondiale Pasos Libres da Calpe: semifinali e gran finali, dal 23 al 25 ottobre 2026.",
    eyebrow: "Mondiale Pasos Libres · 2026",
    h1: "In diretta",
    lead: "Le semifinali e le gran finali del Mondiale, in diretta da Calpe. Ogni schermo si accende da solo quando quella competizione sale sul palco.",
    jornadas: "Si trasmettono le giornate di venerdì 23, sabato 24 e domenica 25.",
    menu: "IN DIRETTA",
    directo: "IN DIRETTA",
    luego: "A seguire",
    sinEnlace: "La diretta si attiverà durante il festival.",
    verAhora: "Guarda in diretta",
    cargando: "Un momento…",
    activas: (n) => (n === 1 ? "1 competizione in diretta" : n + " competizioni in diretta"),
    ningunaActiva: "In questo momento nessuna competizione è sul palco.",
    antesDelFestival: "La diretta inizia venerdì 23 ottobre.",
    despuesDelFestival: "Il Mondiale è finito. I video saranno pubblicati nei prossimi giorni.",
    proximo: "Inizia alle",
    terminada: "Conclusa",
    verPrograma: "Vedi il programma completo",
    horaLocal: "Orario di Calpe (Spagna)",
    avisoDatos: "La diretta consuma parecchi dati. Fuori casa, meglio con il wifi.",
  },
};
