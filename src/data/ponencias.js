// Ponencias · el ciclo de charlas profesionales del festival.
//
// Son las sesiones marcadas como "Ciclo Crecimiento Profesional" en
// src/data/programa.js. Aquí se repiten los datos que la página necesita
// (ponente, foto, titular) porque el programa solo guarda una línea de texto.
//
// El día, la hora y la sala NO se escriben aquí: se leen del programa, para
// que no haya dos sitios que puedan contradecirse si se mueve una charla.

export const PONENCIAS = [
  {
    // La clave con la que se busca en el programa: el texto español exacto.
    clave: "Ciclo Crecimiento Profesional: el error en directo, estrategias para el reenfoque inmediato",
    ponente: "Alessandro Massaro",
    img: "Alessandro-Massaro.webp",
    ig: "https://www.instagram.com/ale.massaro86/",
    titulo: {
      es: "El error en directo",
      en: "Mistakes on stage",
      it: "L'errore in diretta",
    },
    bajada: {
      es: "Estrategias para el reenfoque inmediato cuando algo sale mal delante del público.",
      en: "How to refocus on the spot when something goes wrong in front of an audience.",
      it: "Strategie per ritrovare la concentrazione quando qualcosa va storto davanti al pubblico.",
    },
  },
  {
    clave: "Ciclo Crecimiento Profesional: fiscalidad y gestión empresarial para bailarines autónomos y escuelas de baile",
    ponente: "Esteban Molina",
    img: null, // pendiente: falta su foto
    titulo: {
      es: "Fiscalidad y gestión",
      en: "Tax and business",
      it: "Fisco e gestione",
    },
    bajada: {
      es: "Para bailarines autónomos y escuelas de baile: facturar, declarar y no llevarse sustos.",
      en: "For freelance dancers and dance schools: invoicing, taxes and no nasty surprises.",
      it: "Per ballerini autonomi e scuole di ballo: fatturare, dichiarare e nessuna sorpresa.",
    },
  },
  {
    clave: "Ciclo Crecimiento Profesional: redes sociales sin humo, lo que funciona, lo que no y lo que viene con la IA en nuestro sector laboral",
    ponente: "Manuel Ruiz",
    img: "manuel-ruiz.webp",
    web: "https://digitalstrategy.es",
    titulo: {
      es: "Redes sociales sin humo",
      en: "Social media without the hype",
      it: "Social senza fumo",
    },
    bajada: {
      es: "Lo que funciona, lo que no, y lo que viene con la inteligencia artificial en nuestro sector.",
      en: "What works, what doesn't, and what AI is bringing to our industry.",
      it: "Cosa funziona, cosa no e cosa porta l'intelligenza artificiale nel nostro settore.",
    },
  },
];

export const I18N = {
  es: {
    ruta: "/ponencias/",
    metaTitle: "Ponencias · Charlas profesionales · La Negra Dance Festival",
    metaDesc: "Tres charlas sobre la profesión: el error en directo, fiscalidad para bailarines y redes sociales. Calpe, 21–25 de octubre de 2026.",
    eyebrow: "Mundial de Pasos Libres · 2026",
    h1: "Ponencias",
    lead: "Tres charlas sobre el oficio, no sobre los pasos: qué hacer cuando algo sale mal en el escenario, cómo llevar tus cuentas y qué funciona de verdad en redes. Entran con el Full Pass.",
    enPrograma: "Ver la programación completa",
    pendiente: "Foto pendiente",
    sinHorario: "Horario por confirmar",
  },
  en: {
    ruta: "/en/talks/",
    metaTitle: "Talks · Professional sessions · La Negra Dance Festival",
    metaDesc: "Three talks about the profession: mistakes on stage, tax for dancers and social media. Calpe, 21–25 October 2026.",
    eyebrow: "Pasos Libres World Championship · 2026",
    h1: "Talks",
    lead: "Three talks about the job, not the steps: what to do when something goes wrong on stage, how to handle your accounts and what really works on social media. Included with the Full Pass.",
    enPrograma: "See the full programme",
    pendiente: "Photo coming",
    sinHorario: "Time to be confirmed",
  },
  it: {
    ruta: "/it/conferenze/",
    metaTitle: "Conferenze · Incontri professionali · La Negra Dance Festival",
    metaDesc: "Tre incontri sulla professione: l'errore in diretta, fisco per ballerini e social media. Calpe, 21–25 ottobre 2026.",
    eyebrow: "Mondiale di Pasos Libres · 2026",
    h1: "Conferenze",
    lead: "Tre incontri sul mestiere, non sui passi: cosa fare quando qualcosa va storto sul palco, come gestire i conti e cosa funziona davvero sui social. Inclusi nel Full Pass.",
    enPrograma: "Vedi il programma completo",
    pendiente: "Foto in arrivo",
    sinHorario: "Orario da confermare",
  },
};
