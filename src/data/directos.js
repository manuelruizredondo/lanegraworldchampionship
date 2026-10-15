// Emisiones en directo del festival.
//
// QUÉ HAY QUE RELLENAR: solo `fuente` de cada pantalla. Mientras esté vacío la
// pantalla sale en modo «aún no disponible» y la página sigue funcionando, así
// que se puede publicar antes de tener los enlaces.
//
//   tipo: "youtube"  → `fuente` es el ID del vídeo o de la emisión
//                      (lo que va detrás de ?v= o de youtu.be/)
//   tipo: "iframe"   → `fuente` es la URL completa que dé el proveedor
//
// QUÉ SALA ES CUÁL: la clave `sala` tiene que coincidir con las de programa.js
// (gs, pb, s1, s2). De ahí saca la página qué se está emitiendo a cada hora:
// no hay que tocar nada cuando cambie el horario, se lee de la programación.
//
// Si una sala no se emite, se quita de la lista y ya está.

export const PANTALLAS = [
  { sala: "gs", tipo: "youtube", fuente: "", cartel: "/img/salas/gran-salon-mundial.webp" },
  { sala: "pb", tipo: "youtube", fuente: "", cartel: null },
  { sala: "s1", tipo: "youtube", fuente: "", cartel: "/img/salas/sala-1.webp" },
  { sala: "s2", tipo: "youtube", fuente: "", cartel: "/img/salas/sala-2.webp" },
];

// El festival se celebra en España: lo que está «en directo ahora» se calcula
// siempre en hora de Madrid, no en la del dispositivo de quien mira. Si no,
// alguien en México vería la sala equivocada marcada como activa.
export const ZONA = "Europe/Madrid";

// Año de la edición. Las fechas de programa.js vienen como "21 OCT", sin año.
export const ANIO = 2026;

export const I18N = {
  es: {
    ruta: "/en-directo/",
    metaTitle: "En directo · La Negra Dance Festival",
    metaDesc: "Sigue en directo el XV Mundial de Pasos Libres desde Calpe: las salas del festival emitiendo en vivo, del 21 al 25 de octubre de 2026.",
    eyebrow: "Mundial de Pasos Libres · 2026",
    h1: "En directo",
    lead: "Las salas del festival, emitiendo en vivo desde Calpe. Cada pantalla se enciende sola cuando empieza lo que toca en esa sala.",
    menu: "EN DIRECTO",
    directo: "EN DIRECTO",
    ahora: "Ahora",
    luego: "A continuación",
    enEspera: "En espera",
    sinEmision: "Esta sala no emite ahora mismo.",
    sinEnlace: "El directo de esta sala se activará durante el festival.",
    verAhora: "Ver esta sala",
    cargando: "Un momento…",
    salasActivas: (n) => (n === 1 ? "1 sala emitiendo ahora" : n + " salas emitiendo ahora"),
    ningunaActiva: "Ahora mismo no hay ninguna sala emitiendo.",
    antesDelFestival: "El directo empieza el miércoles 21 de octubre.",
    despuesDelFestival: "El festival ha terminado. Los vídeos se publicarán en los próximos días.",
    proximo: "Empieza a las",
    verPrograma: "Ver la programación completa",
    horaLocal: "Horario de Calpe (España)",
    avisoDatos: "El directo consume bastantes datos. Si estás fuera de casa, mejor con wifi.",
  },
  en: {
    ruta: "/en/live/",
    metaTitle: "Live · La Negra Dance Festival",
    metaDesc: "Watch the XV Pasos Libres World Championship live from Calpe: the festival rooms streaming in real time, 21–25 October 2026.",
    eyebrow: "Pasos Libres World Championship · 2026",
    h1: "Live",
    lead: "The festival rooms, streaming live from Calpe. Each screen switches itself on when its room starts.",
    menu: "LIVE",
    directo: "LIVE",
    ahora: "Now",
    luego: "Up next",
    enEspera: "Standing by",
    sinEmision: "This room isn't streaming right now.",
    sinEnlace: "This room's stream goes live during the festival.",
    verAhora: "Watch this room",
    cargando: "One moment…",
    salasActivas: (n) => (n === 1 ? "1 room streaming now" : n + " rooms streaming now"),
    ningunaActiva: "No room is streaming right now.",
    antesDelFestival: "The stream starts on Wednesday 21 October.",
    despuesDelFestival: "The festival is over. Videos will go up over the next few days.",
    proximo: "Starts at",
    verPrograma: "See the full programme",
    horaLocal: "Calpe time (Spain)",
    avisoDatos: "Live video uses a lot of data. On the move, wifi is a better idea.",
  },
  it: {
    ruta: "/it/in-diretta/",
    metaTitle: "In diretta · La Negra Dance Festival",
    metaDesc: "Segui in diretta il XV Mondiale Pasos Libres da Calpe: le sale del festival in streaming, dal 21 al 25 ottobre 2026.",
    eyebrow: "Mondiale Pasos Libres · 2026",
    h1: "In diretta",
    lead: "Le sale del festival, in diretta da Calpe. Ogni schermo si accende da solo quando inizia quello che tocca in quella sala.",
    menu: "IN DIRETTA",
    directo: "IN DIRETTA",
    ahora: "Ora",
    luego: "A seguire",
    enEspera: "In attesa",
    sinEmision: "Questa sala non sta trasmettendo in questo momento.",
    sinEnlace: "La diretta di questa sala si attiverà durante il festival.",
    verAhora: "Guarda questa sala",
    cargando: "Un momento…",
    salasActivas: (n) => (n === 1 ? "1 sala in diretta ora" : n + " sale in diretta ora"),
    ningunaActiva: "In questo momento nessuna sala sta trasmettendo.",
    antesDelFestival: "La diretta inizia mercoledì 21 ottobre.",
    despuesDelFestival: "Il festival è finito. I video saranno pubblicati nei prossimi giorni.",
    proximo: "Inizia alle",
    verPrograma: "Vedi il programma completo",
    horaLocal: "Orario di Calpe (Spagna)",
    avisoDatos: "La diretta consuma parecchi dati. Fuori casa, meglio con il wifi.",
  },
};
