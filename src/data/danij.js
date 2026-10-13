// Votación del repertorio del concierto de Dani J (domingo 25 de octubre de 2026, 22:00).
// El público elige sus 10 canciones y las ordena de mejor a peor.
//
// La lista viene del formulario que nos pasó la organización, en su mismo orden
// (de la canción más reciente a la más antigua) y con su grafía: no se corrige
// ni se traduce, porque es el título con el que las reconoce la gente.

export const CANCIONES = [
  "VOODOO",
  "VICIO",
  "QUE HABLEN",
  "FANÁTICO",
  "BAILÁNDOTE",
  "RUTA 66",
  "EL CORAZÓN NO PERDONA",
  "ENTRE LA ESPADA Y LA PARED",
  "NIÑA SIN TI",
  "100 AÑOS CONTIGO (SALSA)",
  "aMARTE (SALSA)",
  "VULNERABLE",
  "ASI DE RICO",
  "NO ME HAGO EL DURO (BACHATA VERSION)",
  "DTMF (BACHATA VERSION)",
  "MEDLEY DADDY YANKEE (BACHATA VERSION)",
  "RATA DE DOS PATAS (BACHATA VERSION)",
  "ROSAS",
  "SOLITA",
  "BUENAS NOCHES MI AMOR",
  "COMO TU NO HAY DOS (BACHATA VERSION)",
  "MILLONARIA",
  "SEXTING",
  "TOKYO",
  "ENTRE UN MILLÓN (BACHATA VERSION)",
  "NO ME ACOSTUMBRO (BACHATA VERSION)",
  "QUE TIENES TU (BACHATA VERSION)",
  "TE PIDO (BACHATA VERSION)",
  "TAN SOLO TU (BACHATA VERSION)",
  "TULUM (BACHATA VERSION)",
  "PISCINA (BACHATA VERSION)",
  "SI TU NO ESTAS AQUÍ (BACHATA VERSION)",
  "13",
  "LOCA",
  "SEVEN (BACHATA VERSION)",
  "NO VUELVO A CAER",
  "ATEMPORAL",
  "DISPARO AL CORAZÓN",
  "VILLANO",
  "7 PECADOS",
  "BORRACHO",
  "CAPRICHITO",
  "PEÓN",
  "MIL VIDAS",
  "ME GUSTA",
  "TE QUIERO A TI (BACHATA VERSION)",
  "GITANA",
  "CASI TUYA",
  "LEY DE GRAVEDAD (BACHATA VERSION)",
  "LUNES X LA MAÑANA (SALSA)",
  "LUCES (SALSA)",
  "ACÉRCATE A MI (SALSA)",
  "MIEDO (SALSA)",
  "DOBLE O NADA (SALSA)",
  "QUEDATE UNA NOCHE MÁS (SALSA)",
  "LUNA (SALSA)",
  "INOLVIDABLE (SALSA)",
  "TU JUGUETE",
  "NIÑA PIENSA EN TI (BACHATA VERSION)",
  "MENTIRAS",
  "DECÍDETE",
  "1+1",
  "VENTE",
  "QUE HACES CON EL",
  "BÉSAME (BACHATA VERSION)",
  "ENTRE TÚ Y MIL MARES (BACHATA VERSION)",
  "TRA TE E IL MARE (BACHATA VERSION)",
  "BIPOLAR",
  "BLINDING LIGHTS (BACHATA VERSION)",
  "TENTACIÓN",
  "ALÉJATE DE MI (BACHATA VERSION)",
  "UNA FLOR (BACHATA VERSION)",
  "MI MALDICIÓN",
  "FAVORITO (BACHATA VERSION)",
  "QUÍEN LO DIRIA",
  "QUIERO QUEDARME CONTIGO",
  "TODO DE MI",
  "SUPERSTICIÓN",
  "AIRE",
  "BACHATA SENSUAL",
  "TÚ O YO",
  "BAILEMOS DESPACIO",
  "ME DERRUMBO",
  "DEVUÉLVEME LA VIDA (BACHATA VERSION)",
  "HASTA CUANDO (BACHATA VERSION)",
  "LA ÚLTIMA NOCHE (BACHATA VERSION)",
  "DJ GOT US FALLIN'IN LOVE (BACHATA VERSION)",
  "IT'S A MANS WORLD (BACHATA VERSION)",
  "DECIDISTE DEJARME (BACHATA VERSION)",
  "PEDACITOS DE TI (BACHATA VERSION)",
  "Y AHORA (BACHATA VERSION)",
  "COMO TE ATREVES (BACHATA VERSION)",
  "TODO NO ES CASUALIDAD (BACHATA VERSION)",
  "DESÁTAME (BACHATA VERSION)",
  "CONTANDO MINUTOS",
  "TAN LEJOS DE MÍ",
  "AMOR ETERNO",
  "QUITEMONOS LA ROPA (BACHATA VERSION)",
  "CONFIESALE",
  "TÚ",
  "DESNÚDATE",
  "AMOR PROHIBIDO",
  "QUIERO HABLARTE",
  "SIN TI",
  "TRAICIÓN",
  "QUÉDATE CONMIGO",
];

// Vídeo de YouTube de cada canción, para la escucha previa: título exacto de
// la lista de arriba → id de 11 caracteres (lo que va detrás de "watch?v=").
// Solo sale el botón de play en las canciones que estén aquí; las que falten
// se quedan sin él, antes que abrir un vídeo equivocado.
//
// Para añadir una: copia la URL del vídeo en YouTube y quédate con el id.
//   https://www.youtube.com/watch?v=dQw4w9WgXcQ  →  "dQw4w9WgXcQ"
export const YT = {
  "VOODOO": "9Uucv8qF-MU",  // Dani J - Voodoo (Videoclip Oficial)
  "VICIO": "evawUbA9DYo",  // Dani J - Vicio (Videoclip Oficial)
  "QUE HABLEN": "LS9_4cvQIQA",  // Dani J - Que Hablen ft. Korke & Judith
  "FANÁTICO": "Zd-nBRmPWVs",  // Dani J - Fanático (Official Video)
  "BAILÁNDOTE": "xy-oNPhVvao",  // Dani J - Bailándote - Benidorm Fest 2026
  "RUTA 66": "pRM8szWDv5U",  // Dani J - RUTA 66 (Videoclip Oficial)
  "EL CORAZÓN NO PERDONA": "9K7Lai67ZQc",  // Mr. Don, Dani J, DerekVinci - El Corazón No Perdona
  "ENTRE LA ESPADA Y LA PARED": "NWm6_K9HjT0",  // Dani J & Pinto Picasso - Entre La Espada Y La Pared
  "NIÑA SIN TI": "beEnyP5YhxE",  // Sergio Contreras y Dani J - Niña sin ti
  "100 AÑOS CONTIGO (SALSA)": "ZgAw-cYcyOk",  // Dani J & Dj Fabrizio Zoro - 100 AÑOS CONTIGO (Salsa)
  "aMARTE (SALSA)": "SDbiZAwy_KQ",  // Dani J & Dj Fabrizio Zoro - aMarte
  "VULNERABLE": "CePn8y-wLRU",  // Joana Santos, Dani J - VULNERABLE
  "ASI DE RICO": "hgk_dJi0jQ0",  // ASÍ DE RICO - MONTELIER ft DANI J
  "NO ME HAGO EL DURO (BACHATA VERSION)": "u7F7CPOaYUU",  // Dani J - No Me Hago El Duro (Bachata Version)
  "DTMF (BACHATA VERSION)": "AwJbP04eHZU",  // Dani J - DtMF (Bachata Version)
  "MEDLEY DADDY YANKEE (BACHATA VERSION)": "N66XXuQgX_I",  // Dani J - Daddy Yankee Medley (Bachata Version)
  "RATA DE DOS PATAS (BACHATA VERSION)": "bxmubVimJNc",  // Dani J - Rata de Dos Patas (Bachata Version)
  "ROSAS": "7Jf6YB6-S-I",  // Dani J & Kewin Cosmos - Rosas
  "SOLITA": "r4FYwW8szq4",  // Nesty x Dani J - Solita
  "BUENAS NOCHES MI AMOR": "E1wk5FY8NiU",  // Dani J & Marco Puma - Buenas Noches Mi Amor
  "COMO TU NO HAY DOS (BACHATA VERSION)": "zesXzES7wA4",  // Dani J - COMO TÚ NO HAY DOS
  "MILLONARIA": "nQlY7Kq-zws",  // Dani J - Millonaria
  "TOKYO": "BcEHjSrSPbw",  // Dani J - Tokyo
  "ENTRE UN MILLÓN (BACHATA VERSION)": "Q1mwcYUN-6M",  // Dani J, DJ Ramon - Entre Un Millón (Bachata Version)
  "NO ME ACOSTUMBRO (BACHATA VERSION)": "QBtV2BSCA6c",  // Dani J, Dj Husky - No Me Acostumbro (Bachata Version)
  "QUE TIENES TU (BACHATA VERSION)": "3MmEwxcTByA",  // Dani J, Ryan Miles - Qué tienes tú (Bachata Version)
  "TE PIDO (BACHATA VERSION)": "hEYPrUubYc8",  // Dani J, DJ Alejandro, Dimen5ions - Te Pido (Bachata Version)
  "TAN SOLO TU (BACHATA VERSION)": "-_0aAA-MDtQ",  // Dani J, Dj León - Tan Solo Tú (Bachata Version)
  "TULUM (BACHATA VERSION)": "X2VnqyWU9Jo",  // Dani J, Dj Tony Pecino - Tulum (Bachata Version)
  "PISCINA (BACHATA VERSION)": "XxpgoGUGw9I",  // Dani J & Dj Tronky - Piscina (Bachata Version)
  "SI TU NO ESTAS AQUÍ (BACHATA VERSION)": "1FmTSA9ONhA",  // Dani J, Dj Tony - Si Tú No Estás Aquí (Bachata Version)
  "13": "AjtfBlm4fnY",  // Dani J - 13 (Videoclip Oficial)
  "LOCA": "AmHvTxyBowE",  // Dani J x Efrem J - LOCA
  "SEVEN (BACHATA VERSION)": "gbAKuplJQkc",  // Dani J - Seven (Bachata Version)
  "NO VUELVO A CAER": "MIcB_MW0g44",  // Dani J - No Vuelvo A Caer
  "ATEMPORAL": "_JzoQ06LkA0",  // Dani J, Danny Romero - Atemporal
  "DISPARO AL CORAZÓN": "GswKJdc2biQ",  // Dani J - Disparo Al Corazón
  "VILLANO": "O__YH8ChLYI",  // Dani J - Villano
  "7 PECADOS": "BlsNeRhIDpY",  // Dani J - 7 Pecados
  "BORRACHO": "pNs55eVcfV0",  // Román, Dani J - Borracho
  "CAPRICHITO": "gIxYp0QunbI",  // Dani J - Caprichito
  "PEÓN": "arvXDzPKH80",  // Dani J, Caluu C - Peón
  "MIL VIDAS": "leY1HrwwZNQ",  // Dani J - Mil Vidas
  "ME GUSTA": "ZKPwEeiwURc",  // Dani J - Me Gusta
  "TE QUIERO A TI (BACHATA VERSION)": "Jl_geciBGWc",  // Soraya & Dani J - Te Quiero A Ti (Versión Bachata)
  "GITANA": "l0bPbxWDwO8",  // Gitana - Dani J ft Luis&Andrea
  "CASI TUYA": "nr8Tzf-i4-k",  // Joana Santos, Dani J - CASI TUYA
  "LEY DE GRAVEDAD (BACHATA VERSION)": "9GhbcnWbOnA",  // Dani J, DJ Dimen5ions & DJ Alejandro - Ley de Gravedad
  "LUNES X LA MAÑANA (SALSA)": "NMhp66NIvDE",  // Dani J - Lunes X La Mañana
  "LUCES (SALSA)": "YnYqXBIVDq0",  // Dani J - Luces (Audio Oficial) Salsa
  "ACÉRCATE A MI (SALSA)": "rQ5HPJ-zgcY",  // Dani J - Acércate A Mi (Audio Oficial) Salsa
  "MIEDO (SALSA)": "V5q4QaptAf8",  // Dani J - Miedo (Audio Oficial) Salsa
  "DOBLE O NADA (SALSA)": "0lGUIW37tbM",  // Dani J - Doble O Nada (Audio Oficial) Salsa
  "QUEDATE UNA NOCHE MÁS (SALSA)": "CXJw4uckzC0",  // Dani J Ft. La Máxima79 - Quédate Una Noche Más (Salsa)
  "LUNA (SALSA)": "uCXUyMW4-8A",  // Dani J - Luna (Audio Oficial) Salsa
  "INOLVIDABLE (SALSA)": "IZRKUf27bmE",  // Dani J, La Máxima 79 - Inolvidable
  "TU JUGUETE": "oMa-fVm7FnE",  // Dani J - Tu Juguete
  "NIÑA PIENSA EN TI (BACHATA VERSION)": "88cC2PA65Ws",  // Dani J - Niña Piensa En Ti
  "MENTIRAS": "DhOCCPKVUh0",  // Dani J, Kewin Cosmos - Mentiras
  "DECÍDETE": "KKtX-9bZTHQ",  // Dani J, Bachata Heightz - Decídete
  "1+1": "MGg8tSUzffQ",  // Mario Baro, Dani J - 1 + 1
  "VENTE": "gzMneT9oIVs",  // Dani J, Be Yhong - Vente
  "QUE HACES CON EL": "MDQHwT3cS8E",  // Marco Puma & Dani J - Que Haces Con El
  "BÉSAME (BACHATA VERSION)": "sYJJxSqDdVM",  // Bésame - Dani J, Sanco, Dj Husky
  "ENTRE TÚ Y MIL MARES (BACHATA VERSION)": "GZq0LWDBYn0",  // Dani J - Entre Tú Y Mil Mares
  "TRA TE E IL MARE (BACHATA VERSION)": "dtm9ukWtywA",  // Dani J - Tra Te e il Mare (versión Italiano)
  "BIPOLAR": "3cKtiGX2SP0",  // Dani J, Dama - Bipolar
  "BLINDING LIGHTS (BACHATA VERSION)": "xfX73hD51MA",  // Dani J - Blinding Lights (Bachata Cover)
  "TENTACIÓN": "CCfkGngBblQ",  // Dani J - Tentación
  "ALÉJATE DE MI (BACHATA VERSION)": "4409ycNRNlI",  // Dani J - Aléjate De Mi (Versión Bachata)
  "UNA FLOR (BACHATA VERSION)": "R_o4F5sNPJw",  // Dani J Ft. Dimen5ions, DJ Alejandro - Una Flor (Versión Bachata)
  "MI MALDICIÓN": "euxrnHCjfF0",  // Dani J - Mi Maldición
  "FAVORITO (BACHATA VERSION)": "qxZeKpSXIGE",  // Dani J - Favorito (Version Bachata)
  "QUÍEN LO DIRIA": "_MI0JPE4KC0",  // Dani J - Quién Lo Diría
  "QUIERO QUEDARME CONTIGO": "l8TMwagrz3I",  // Dani J - Quiero Quedarme Contigo
  "TODO DE MI": "M9IIxmKpJYk",  // Dani J - Todo De Mi
  "SUPERSTICIÓN": "mBBdsvRAJrE",  // Dani J - Superstición
  "AIRE": "IQyVbzMgt0E",  // Dani J Ft. Xriz - Aire
  "TÚ O YO": "h-86Lv6Us4c",  // Manny Rod, Dani J - Tú o Yo
  "BAILEMOS DESPACIO": "wOCEZyll1C4",  // Dani J - Bailemos Despacio
  "ME DERRUMBO": "Pc7y1S_KyGs",  // Dani J - Me Derrumbo
  "DEVUÉLVEME LA VIDA (BACHATA VERSION)": "j8etGnvwHnI",  // Dani J - Devuélveme La Vida (Versión Bachata)
  "HASTA CUANDO (BACHATA VERSION)": "Y-uvuSzGEIM",  // Dani J Ft. Sanco - Hasta Cuando (Version Bachata)
  "LA ÚLTIMA NOCHE (BACHATA VERSION)": "eiCr_6-Chc4",  // Dani J - La Última Noche (Versión Bachata)
  "DJ GOT US FALLIN'IN LOVE (BACHATA VERSION)": "8DF2tLhNJBA",  // Dani J - DJ Got Us Fallin'in Love (Versión Bachata)
  "IT'S A MANS WORLD (BACHATA VERSION)": "n5JISUrn8wo",  // Dani J - Is A Mans World (Versión Bachata)
  "DECIDISTE DEJARME (BACHATA VERSION)": "LD-SVGvVUGs",  // Decidiste Dejarme - Dani J ft. Panacea Project
  "PEDACITOS DE TI (BACHATA VERSION)": "c6x2QJ2zjPM",  // Pedacitos De Ti - Dj Khalid Ft. Dani J
  "Y AHORA (BACHATA VERSION)": "r9psXg9m6Dw",  // Dani J - Y Ahora (Versión Bachata)
  "COMO TE ATREVES (BACHATA VERSION)": "are0YLwGlEU",  // Dani J - Como Te Atreves (Versión Bachata)
  "TODO NO ES CASUALIDAD (BACHATA VERSION)": "OuEB6pd8yrs",  // Todo No Es Casualidad - Dani J
  "DESÁTAME (BACHATA VERSION)": "oXn_XCHvLPE",  // Bea J Ft. Dani J - Desátame (versión Bachata)
  "CONTANDO MINUTOS": "IKa9THZPAVw",  // Daniel Santacruz, Dani J - Contando Minutos
  "TAN LEJOS DE MÍ": "4-6Brm_oP10",  // Dani J - Tan Lejos De Mi
  "AMOR ETERNO": "08mHlZ60eqM",  // Dani J - Amor Eterno
  "QUITEMONOS LA ROPA (BACHATA VERSION)": "IQ3kiBUsexY",  // Dani J - Quitémonos La Ropa
  "CONFIESALE": "VRhGMCYvWQ4",  // Dani J - Confiésale
  "TÚ": "0i4H1CJC83k",  // Dani J - Tú
  "AMOR PROHIBIDO": "5mCxZa9v3Po",  // Dani J - Amor Prohibido
  "QUIERO HABLARTE": "TNHDbmSr6J0",  // Dani J - Quiero Hablarte
  "SIN TI": "fS_0wjLdgXE",  // Dani J - Sin Ti
  "TRAICIÓN": "Wjq_TmZUoXs",  // Dani J - Traición
  "QUÉDATE CONMIGO": "fFS7fyKM6zM",  // Dani J - Quédate Conmigo
};

export const MAX_VOTOS = 10;

// Cierre de la votación: lo que anuncia el flyer, 24 de octubre de 2026 a las
// 21:00 hora peninsular (ese día todavía rige el horario de verano, UTC+2).
export const CIERRE = "2026-10-24T21:00:00+02:00";

export const I18N = {
  es: {
    metaTitle: "Tú eliges el repertorio · Concierto de Dani J",
    metaDesc:
      "Vota tus 10 canciones favoritas de Dani J y ordénalas: las más votadas sonarán en el concierto del XV Mundial de Pasos Libres, en Calpe.",
    eyebrow: "Dani J · Concierto del domingo 25",
    h1: "Tú eliges el repertorio",
    lead: "Imagina que pudieras elegir el repertorio del concierto. ¿Qué 10 canciones de Dani J no podrían faltar? Vota las tuyas y ordénalas de la que más te apetece a la que menos.",
    orden: "Están ordenadas de la más reciente a la más antigua.",
    emailLabel: "Tu email",
    emailPh: "tu@email.com",
    emailAyuda: "Solo para evitar votos repetidos. No lo publicamos.",
    buscar: "Buscar canción…",
    elegidas: "elegidas",
    de: "de",
    tuTop: "Tu top 10",
    vacio: "Todavía no has elegido ninguna. Pulsa sobre las canciones de abajo.",
    subir: "Subir",
    bajar: "Bajar",
    quitar: "Quitar",
    enviar: "Enviar mi votación",
    enviando: "Enviando…",
    sinResultados: "Ninguna canción coincide con la búsqueda.",
    limpiar: "Quitar el filtro",
    okTitulo: "¡Votación registrada!",
    okTexto: "Gracias por votar. Las canciones más votadas formarán parte del show.",
    okVolver: "Ver la programación del festival",
    errEmail: "Escribe un email válido.",
    errPocas: "Elige las 10 canciones para poder enviar tu votación.",
    faltaUna: "Te queda 1 canción por elegir.",
    faltanVarias: "Te quedan {n} canciones por elegir.",
    errGenerico: "No se ha podido guardar tu votación. Inténtalo de nuevo en un momento.",
    cerradaTitulo: "La votación está cerrada",
    cerradaTexto: "El plazo terminó el 24 de octubre a las 21:00. Nos vemos en el concierto.",
    plazo: "Se puede votar hasta el 24 de octubre a las 21:00 h.",
    maxAviso: "Ya tienes 10. Quita alguna si quieres cambiarla.",
    concierto: {
      eyebrow: "Domingo 25 de octubre · Gran Salón",
      h2: "Dani J, en concierto",
      lead: "El festival se cierra con el directo de Dani J a las 22:00, con una pre-party desde las 20:30. Tu Full Pass ya lo incluye; si solo quieres venir al concierto, hay entrada suelta por 35 € que da acceso también al social de después.",
      btn: "Comprar entradas",
      link: "Vota el repertorio del concierto",
      nota: "Solo para mayores de 16 años.",
      compraTitulo: "Entradas para el concierto",
      compraLead: "El Full Pass (189 €) ya incluye el concierto. La entrada suelta son 35 € y vale para el concierto y el social de después.",
      compraIr: "Ir a la página de entradas ↗",
    },
    escuchar: "Escuchar un trozo de",
    cerrarPrev: "Cerrar la escucha",
  },
  en: {
    metaTitle: "You choose the setlist · Dani J in concert",
    metaDesc:
      "Vote for your 10 favourite Dani J songs and rank them: the most voted ones will be played at the concert of the XV Pasos Libres World Championship, in Calpe.",
    eyebrow: "Dani J · Sunday 25 concert",
    h1: "You choose the setlist",
    lead: "Imagine you could pick the concert setlist. Which 10 Dani J songs simply have to be there? Vote for yours and rank them from the one you want most to the one you want least.",
    orden: "They are listed from the most recent to the oldest.",
    emailLabel: "Your email",
    emailPh: "you@email.com",
    emailAyuda: "Only to avoid repeated votes. We don't publish it.",
    buscar: "Search for a song…",
    elegidas: "chosen",
    de: "of",
    tuTop: "Your top 10",
    vacio: "You haven't chosen any yet. Tap the songs below.",
    subir: "Move up",
    bajar: "Move down",
    quitar: "Remove",
    enviar: "Send my vote",
    enviando: "Sending…",
    sinResultados: "No song matches your search.",
    limpiar: "Clear the filter",
    okTitulo: "Vote registered!",
    okTexto: "Thanks for voting. The most voted songs will be part of the show.",
    okVolver: "See the festival schedule",
    errEmail: "Please enter a valid email.",
    errPocas: "Choose all 10 songs to send your vote.",
    faltaUna: "You have 1 song left to choose.",
    faltanVarias: "You have {n} songs left to choose.",
    errGenerico: "We couldn't save your vote. Please try again in a moment.",
    cerradaTitulo: "Voting is closed",
    cerradaTexto: "The deadline was 24 October at 21:00. See you at the concert.",
    plazo: "You can vote until 24 October at 21:00 (Spanish time).",
    maxAviso: "You already have 10. Remove one if you want to swap it.",
    concierto: {
      eyebrow: "Sunday 25 October · Main Hall",
      h2: "Dani J, live",
      lead: "The festival closes with Dani J live at 22:00, with a pre-party from 20:30. Your Full Pass already includes it; if you only want the concert, there's a separate €35 ticket that also gets you into the social afterwards.",
      btn: "Buy tickets",
      link: "Vote for the concert setlist",
      nota: "Over-16s only.",
      compraTitulo: "Tickets for the concert",
      compraLead: "The Full Pass (€189) already includes the concert. The separate ticket is €35 and covers the concert and the social afterwards.",
      compraIr: "Go to the ticket page ↗",
    },
    escuchar: "Preview",
    cerrarPrev: "Close the preview",
  },
  it: {
    metaTitle: "Scegli tu la scaletta · Concerto di Dani J",
    metaDesc:
      "Vota le tue 10 canzoni preferite di Dani J e mettile in ordine: le più votate suoneranno al concerto del XV Mondiale di Pasos Libres, a Calpe.",
    eyebrow: "Dani J · Concerto di domenica 25",
    h1: "Scegli tu la scaletta",
    lead: "Immagina di poter scegliere la scaletta del concerto. Quali 10 canzoni di Dani J non possono mancare? Vota le tue e mettile in ordine, dalla più desiderata alla meno.",
    orden: "Sono ordinate dalla più recente alla più vecchia.",
    emailLabel: "La tua email",
    emailPh: "tua@email.com",
    emailAyuda: "Serve solo per evitare voti ripetuti. Non la pubblichiamo.",
    buscar: "Cerca una canzone…",
    elegidas: "scelte",
    de: "di",
    tuTop: "La tua top 10",
    vacio: "Non ne hai ancora scelta nessuna. Tocca le canzoni qui sotto.",
    subir: "Su",
    bajar: "Giù",
    quitar: "Togli",
    enviar: "Invia il mio voto",
    enviando: "Invio…",
    sinResultados: "Nessuna canzone corrisponde alla ricerca.",
    limpiar: "Togli il filtro",
    okTitulo: "Voto registrato!",
    okTexto: "Grazie per aver votato. Le canzoni più votate faranno parte dello show.",
    okVolver: "Vedi il programma del festival",
    errEmail: "Inserisci un'email valida.",
    errPocas: "Scegli tutte e 10 le canzoni per inviare il tuo voto.",
    faltaUna: "Ti manca 1 canzone da scegliere.",
    faltanVarias: "Ti mancano {n} canzoni da scegliere.",
    errGenerico: "Non siamo riusciti a salvare il tuo voto. Riprova tra un momento.",
    cerradaTitulo: "La votazione è chiusa",
    cerradaTexto: "Il termine era il 24 ottobre alle 21:00. Ci vediamo al concerto.",
    plazo: "Si può votare fino al 24 ottobre alle 21:00 (ora spagnola).",
    maxAviso: "Ne hai già 10. Togline una se vuoi cambiarla.",
    concierto: {
      eyebrow: "Domenica 25 ottobre · Salone",
      h2: "Dani J, in concerto",
      lead: "Il festival si chiude con il live di Dani J alle 22:00, con un pre-party dalle 20:30. Il tuo Full Pass lo include già; se vuoi venire solo al concerto c'è il biglietto singolo da 35 €, che dà accesso anche al social successivo.",
      btn: "Compra i biglietti",
      link: "Vota la scaletta del concerto",
      nota: "Solo per maggiori di 16 anni.",
      compraTitulo: "Biglietti per il concerto",
      compraLead: "Il Full Pass (189 €) include già il concerto. Il biglietto singolo costa 35 € e vale per il concerto e il social successivo.",
      compraIr: "Vai alla pagina dei biglietti ↗",
    },
    escuchar: "Ascolta un pezzo di",
    cerrarPrev: "Chiudi l'anteprima",
  },
};

// Mismo slug en los tres idiomas: el QR del flyer apunta aquí y «concierto-danij»
// se entiende igual en cualquiera de ellos.
export const RUTA = { es: "/concierto-danij/", en: "/en/concierto-danij/", it: "/it/concierto-danij/" };
export const RUTA_PROGRAMA = { es: "/talleres/", en: "/en/workshops/", it: "/it/workshops/" };

// Entradas (go&dance). El Full Pass ya incluye el concierto; la entrada suelta
// vale solo para el concierto y el social de después, y es para mayores de 16.
export const ENTRADAS = {
  // Página de entradas del evento, con las dos opciones
  url: "https://www.goandance.com/es/evento/8885/la-negra-dance-festival-2026-xv-campeonato-mundial-de-pasos-libres-la-negra-salsa-v-campeonato-mundial-de-pasos-libres-la-negra-bachata",
  // Widget embebido; el idioma del iframe va en la ruta (/es/, /en/)
  iframe: (lang) =>
    `https://www.goandance.com/${lang === "it" ? "es" : lang}/event-tickets/` +
    "106ef4d5-c8be-4fce-8660-ea6854726bff" +
    "?referer=https%3A%2F%2Fcampeonatopasoslibres.com%2Fconcierto-danij%2F",
  precioConcierto: "35 €",
  precioPase: "189 €",
};

// Imagen que sale al compartir el enlace (1200x630, una por idioma).
// La genera scripts/og-concierto-danij.py a partir de la foto de prensa.
export const OG = {
  es: "/img/og/concierto-danij.jpg",
  en: "/img/og/concierto-danij-en.jpg",
  it: "/img/og/concierto-danij-it.jpg",
};
