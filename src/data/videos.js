// Vídeos del Mundial (pódium: 1er, 2º y 3er puesto por categoría).
// Canal de YouTube oficial + listado de vídeos. El listado se rellena con los datos que
// facilite la organización. Cada vídeo lleva su ID de YouTube, categoría y puesto (1|2|3).

export const VIDEOS_CHANNEL = "https://www.youtube.com/@LaNegraDanceFestival/videos";

export const VIDEOS_META = {
  es: {
    eyebrow: "El Mundial",
    h1: "Vídeos del Mundial",
    sub: "Revive las mejores actuaciones del Mundial de Pasos Libres: los vídeos de los tres primeros puestos de cada categoría.",
    channelBtn: "Ver el canal en YouTube",
    emptyNote: "Muy pronto publicaremos aquí los vídeos del pódium. Mientras tanto, puedes verlos en nuestro canal de YouTube.",
    places: { 1: "1er puesto", 2: "2º puesto", 3: "3er puesto" },
  },
  en: {
    eyebrow: "The World Championship",
    h1: "Championship videos",
    sub: "Relive the best performances of the Pasos Libres World Championship: videos of the top three in each category.",
    channelBtn: "Visit our YouTube channel",
    emptyNote: "We'll post the podium videos here very soon. In the meantime, you can watch them on our YouTube channel.",
    places: { 1: "1st place", 2: "2nd place", 3: "3rd place" },
  },
  it: {
    eyebrow: "Il Mondiale",
    h1: "Video del Mondiale",
    sub: "Rivivi le migliori esibizioni del Mondiale Pasos Libres: i video dei primi tre classificati di ogni categoria.",
    channelBtn: "Vai al canale YouTube",
    emptyNote: "Pubblicheremo qui a breve i video del podio. Nel frattempo, puoi guardarli sul nostro canale YouTube.",
    places: { 1: "1° posto", 2: "2° posto", 3: "3° posto" },
  },
};

// Listado de vídeos. Se rellena con el listado que pase la organización.
// Formato de cada entrada:
//   { id: "ID_DE_YOUTUBE", category: "Solistas Chicas Salsa", place: 1, title: "Nombre del bailarín/a" }
// - id: la parte final de la URL de YouTube (youtu.be/XXXX o watch?v=XXXX -> XXXX)
// - place: 1, 2 o 3 (para la medalla)
// - category y title son opcionales pero recomendables
export const VIDEOS = [];
