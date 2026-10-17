// Ponencias · el ciclo de charlas profesionales del festival.
//
// Son las sesiones marcadas como "Ponencia" en
// src/data/programa.js. Aquí se repiten los datos que la página necesita
// (ponente, foto, titular) porque el programa solo guarda una línea de texto.
//
// El día, la hora y la sala NO se escriben aquí: se leen del programa, para
// que no haya dos sitios que puedan contradecirse si se mueve una charla.

export const PONENCIAS = [
  {
    // La clave con la que se busca en el programa: el texto español exacto.
    clave: "Ponencia: el error en directo, estrategias para el reenfoque inmediato",
    ponente: "Dr. Alessandro Massaro",
    img: "alessandro-massaro-ponencia.webp",
    ig: "https://www.instagram.com/ale.massaro86/",
    credencial: {
      es: "Psicólogo clínico y del deporte · Coreógrafo y juez internacional",
      en: "Clinical and sports psychologist · International choreographer and judge",
      it: "Psicologo clinico e dello sport · Coreografo e giudice internazionale",
    },
    bio: {
      es: "Psicólogo clínico de orientación psicodinámica, une en un mismo recorrido la psicología y la danza. Formado en Psicología del Deporte con el Máster Psyco Sport y en Sexología Clínica, cursa la especialización en Psicoterapia Psicoanalítica en la SPP de Turín. Es miembro del Comité Médico-Científico de la IDO como psicólogo del deporte y Consejero Regional del Piamonte de la FIPSIS. Director Técnico y Artístico de Al Ma Academy, es juez internacional y entrenador de atletas multicampeones. Más de treinta años en la danza le permiten hablar a los bailarines desde una posición poco común: la de quien conoce la pista con su propio cuerpo, no solo por la teoría.",
      en: "A clinical psychologist with a psychodynamic approach, he brings psychology and dance together in a single career. Trained in Sports Psychology through the Psyco Sport Master's and in Clinical Sexology, he is currently specialising in Psychoanalytic Psychotherapy at the SPP in Turin. He sits on the IDO Medical-Scientific Committee as a sports psychologist and is Regional Counsellor for Piedmont at FIPSIS. Technical and Artistic Director of Al Ma Academy, he is an international judge and coach to multi-champion athletes. Thirty years in dance let him speak to dancers from an unusual place: someone who knows the floor through his own body, not only through theory.",
      it: "Psicologo clinico a orientamento psicodinamico, unisce in un unico percorso la psicologia e la danza. Formato in Psicologia dello Sport con il Master Psyco Sport e in Sessuologia Clinica, frequenta la specializzazione in Psicoterapia Psicoanalitica alla SPP di Torino. È membro del Comitato Medico-Scientifico della IDO come psicologo dello sport e Consigliere Regionale del Piemonte della FIPSIS. Direttore Tecnico e Artistico di Al Ma Academy, è giudice internazionale e coach di atleti pluricampioni. Oltre trent'anni di danza gli permettono di parlare ai ballerini da una posizione rara: quella di chi conosce la pista col proprio corpo, non solo con la teoria.",
    },
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
    clave: "Ponencia: redes sociales sin humo, lo que funciona, lo que no y lo que viene con la IA en nuestro sector laboral",
    ponente: "Manuel Ruiz",
    img: "manuel-ruiz-ponencia.webp",
    web: "https://digitalstrategy.es",
    credencial: {
      es: "Consultor de estrategia digital · 25 años y más de 500 clientes",
      en: "Digital strategy consultant · 25 years and over 500 clients",
      it: "Consulente di strategia digitale · 25 anni e oltre 500 clienti",
    },
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
  {
    clave: "Ponencia: fiscalidad y gestión empresarial para bailarines autónomos y escuelas de baile",
    ponente: "Esteban Molina Pérez",
    img: "esteban-molina-ponencia.webp",
    credencial: {
      es: "Economista colegiado · Especialista en escuelas de baile y artistas",
      en: "Chartered economist · Specialist in dance schools and performers",
      it: "Economista iscritto all'albo · Specialista in scuole di ballo e artisti",
    },
    bio: {
      es: "Licenciado en Ciencias Económicas y Empresariales por la Universidad Autónoma de Madrid y colegiado en el Colegio de Economistas de Madrid. Especialista en régimen fiscal de sociedades y autónomos, y en la gestión empresarial de escuelas de baile y artistas. Su despacho, constituido en 2005, lleva actualmente más de 60 empresas del sector del baile y la música.",
      en: "A graduate in Economics and Business from the Universidad Autónoma de Madrid and a member of the Madrid Association of Economists. He specialises in the tax treatment of companies and the self-employed, and in the business side of dance schools and performers. His firm, founded in 2005, currently looks after more than 60 companies in the dance and music industry.",
      it: "Laureato in Economia e Commercio all'Universidad Autónoma de Madrid e iscritto all'Ordine degli Economisti di Madrid. Specialista in regime fiscale di società e lavoratori autonomi e nella gestione aziendale di scuole di ballo e artisti. Il suo studio, fondato nel 2005, segue oggi più di 60 imprese del settore della danza e della musica.",
    },
    titulo: {
      es: "Fiscalidad y gestión",
      en: "Tax and business",
      it: "Fisco e gestione",
    },
    bajada: {
      es: "Los primeros pasos para emprender tu negocio: cómo crear y desarrollar tu empresa, y todo lo relacionado con impuestos y Seguridad Social.",
      en: "The first steps to starting your business: how to set it up and grow it, plus everything about taxes and social security.",
      it: "I primi passi per avviare la tua attività: come creare e far crescere la tua impresa, più tutto su imposte e previdenza sociale.",
    },
  },
];

export const I18N = {
  es: {
    ruta: "/ponencias/",
    metaTitle: "Ciclo Profesional · Ponencias · La Negra Dance Festival",
    metaDesc: "Tres charlas sobre la profesión: el error en directo, fiscalidad para bailarines y redes sociales. Calpe, 21–25 de octubre de 2026.",
    eyebrow: "Mundial de Pasos Libres · 2026",
    h1: "Ciclo Profesional (Ponencias)",
    lead: "Tres charlas sobre el oficio, no sobre los pasos: qué hacer cuando algo sale mal en el escenario, cómo llevar tus cuentas y qué funciona de verdad en redes. Entran con el Full Pass.",
    enPrograma: "Ver la programación completa",
    verBio: "Quién es",
    sinHorario: "Horario por confirmar",
  },
  en: {
    ruta: "/en/talks/",
    metaTitle: "Professional Series · Talks · La Negra Dance Festival",
    metaDesc: "Three talks about the profession: mistakes on stage, tax for dancers and social media. Calpe, 21–25 October 2026.",
    eyebrow: "Pasos Libres World Championship · 2026",
    h1: "Professional Series (Talks)",
    lead: "Three talks about the job, not the steps: what to do when something goes wrong on stage, how to handle your accounts and what really works on social media. Included with the Full Pass.",
    enPrograma: "See the full programme",
    verBio: "Who they are",
    sinHorario: "Time to be confirmed",
  },
  it: {
    ruta: "/it/conferenze/",
    metaTitle: "Ciclo Professionale · Conferenze · La Negra Dance Festival",
    metaDesc: "Tre incontri sulla professione: l'errore in diretta, fisco per ballerini e social media. Calpe, 21–25 ottobre 2026.",
    eyebrow: "Mondiale di Pasos Libres · 2026",
    h1: "Ciclo Professionale (Conferenze)",
    lead: "Tre incontri sul mestiere, non sui passi: cosa fare quando qualcosa va storto sul palco, come gestire i conti e cosa funziona davvero sui social. Inclusi nel Full Pass.",
    enPrograma: "Vedi il programma completo",
    verBio: "Chi è",
    sinHorario: "Orario da confermare",
  },
};
