// Cómo llegar al festival (ES / EN / IT).
//
// La información estaba repartida entre dos bloques del final de /festival/:
// el transfer y un listado con los aeropuertos. Aquí se reúne todo.
//
// Datos del hotel y del transfer: los que ya daba la web.
// Carretera, autobús y tranvía: según el Ayuntamiento de Calpe y ALSA. No se
// ponen horarios ni precios concretos porque cambian cada temporada; se enlaza
// a quien los publica.

export const SEDE = {
  nombre: "Hotel AR Diamante Beach 4★ Superior",
  calle: "Av. Juan Carlos I, 48",
  cp: "03710",
  ciudad: "Calpe",
  provincia: "Alicante",
  pais: "España",
  mapa: "https://maps.app.goo.gl/1Upi3tNxMANnCbZ87",
  comoLlegar:
    "https://www.google.com/maps/dir/?api=1&destination=AR+Diamante+Beach+Spa+Hotel,+Calpe,+Alicante",
  embed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3115.9332867988783!2d0.07065367592495361" +
    "!3d38.65041427177794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x129dfe00f86d3eef" +
    "%3A0x8f672c62926e85bf!2sAR%20Diamante%20Beach!5e0!3m2!1ses!2ses!4v1742755084006!5m2!1ses!2ses",
};

// Los traslados los opera Beniconnect, una agencia de la Costa Blanca; la
// reserva se hace en su web, no aquí. El inglés vive en la raíz de su sitio y
// no tienen versión italiana, así que el italiano va al inglés.
export const BENICONNECT = {
  es: "https://www.beniconnect.com/es/",
  en: "https://www.beniconnect.com/",
  it: "https://www.beniconnect.com/",
};

// Enlaces externos, en el idioma de cada versión de la página.
//
// Ojo con el TRAM: tramalicante.es redirige a tramalacant.es y, sin prefijo de
// idioma, sale en valenciano. Hay que pedir /es/ o /en/ expresamente.
// ALSA sí tiene italiano; el TRAM y Aena no (Aena solo es/en/valenciano),
// así que en esos dos el italiano va al inglés.
export const ENLACES = {
  es: {
    alsa: "https://www.alsa.es/ruta/alicante-calpe",
    tram: "https://www.tramalacant.es/es/",
    aenaAlc: "https://www.aena.es/es/alicante-elche-miguel-hernandez.html",
    aenaVlc: "https://www.aena.es/es/valencia.html",
  },
  en: {
    alsa: "https://www.alsa.com/en/coach/alicante-calpe",
    tram: "https://www.tramalacant.es/en/",
    aenaAlc: "https://www.aena.es/en/alicante-elche-miguel-hernandez.html",
    aenaVlc: "https://www.aena.es/en/valencia.html",
  },
  it: {
    alsa: "https://www.alsa.com/it/pullman/alicante-calpe",
    tram: "https://www.tramalacant.es/en/",
    aenaAlc: "https://www.aena.es/en/alicante-elche-miguel-hernandez.html",
    aenaVlc: "https://www.aena.es/en/valencia.html",
  },
};

export const I18N = {
  es: {
    ruta: "/como-llegar/",
    metaTitle: "Cómo llegar a La Negra Dance Festival · Calpe, Alicante",
    metaDesc:
      "Cómo llegar al Hotel AR Diamante Beach de Calpe: aeropuertos, servicio de transfer, autobús, tranvía y coche. Toda la información en un sitio.",
    eyebrow: "Dónde nos vemos",
    h1: "Cómo llegar",
    lead: "Todo el festival pasa en el mismo sitio: el Hotel AR Diamante Beach de Calpe, en primera línea de mar y a los pies del Peñón de Ifach. Aquí tienes todas las formas de llegar hasta la puerta.",
    sedeTitulo: "La sede",
    verMapa: "Ver en el mapa",
    rutaBtn: "Abrir la ruta en Google Maps",

    transferTitulo: "El transfer desde Alicante",
    transferLead: "Los traslados los opera Beniconnect, una agencia de la Costa Blanca. Reservas con ellos el trayecto hasta la puerta del hotel: es la forma más cómoda si llegas en avión o en tren.",
    transferAvion: "Desde el aeropuerto de Alicante",
    transferAvionTxt: "Para llegadas y salidas entre las 7:00 y las 23:55.",
    transferTren: "Desde la estación de tren de Alicante",
    transferTrenTxt: "Para llegadas y salidas entre las 9:00 y las 20:15.",
    transferNota: "Al reservar, elige Calpe como destino e indica el Hotel AR Diamante Beach. El precio, los horarios y la confirmación los lleva Beniconnect.",
    transferBtn: "Reservar en Beniconnect ↗",

    avionTitulo: "En avión",
    avionAlc: "Alicante-Elche (ALC)",
    avionAlcTxt: "A unos 50 minutos del hotel. Es el aeropuerto natural del festival y el que usa casi todo el mundo.",
    avionVlc: "Valencia (VLC)",
    avionVlcTxt: "A 1 h 20 min del hotel. Buena alternativa si encuentras mejor vuelo.",

    busTitulo: "En autobús",
    busTxt: "ALSA tiene línea directa entre el aeropuerto de Alicante y Calpe; el viaje ronda las dos horas. También hay servicios desde la estación de autobuses de Alicante y desde Valencia y Benidorm. Los horarios cambian por temporada, así que mira el día de tu viaje.",
    busBtn: "Horarios de ALSA",

    tramTitulo: "En tranvía",
    tramTxt: "La línea 9 del TRAM, entre Benidorm y Dénia, para en Calpe. Desde la ciudad de Alicante se llega con la línea 1 hasta Benidorm y allí se cambia a la 9. Es un viaje bonito, pegado a la costa, pero pasa cada una o dos horas: conviene mirar el horario antes y no dejarlo para el último momento.",
    tramBtn: "Horarios del TRAM",

    cocheTitulo: "En coche",
    cocheTxt: "Por la AP-7 (autopista de peaje), salida 64, Altea/Calpe. La N-332 es la alternativa gratuita y va paralela a la costa: se tarda algo más, pero el paisaje lo compensa. El hotel tiene aparcamiento.",
    cocheBtn: "Abrir la ruta en Google Maps",

    dudasTitulo: "¿Te queda alguna duda?",
    dudasTxt: "Escríbenos y te ayudamos a organizar la llegada.",
    dudasBtn: "Contacto",
  },

  en: {
    ruta: "/en/getting-here/",
    metaTitle: "Getting to La Negra Dance Festival · Calpe, Alicante",
    metaDesc:
      "How to reach the Hotel AR Diamante Beach in Calpe: airports, transfer service, bus, tram and car. Everything in one place.",
    eyebrow: "Where we meet",
    h1: "Getting here",
    lead: "The whole festival happens in one place: the Hotel AR Diamante Beach in Calpe, on the seafront at the foot of the Peñón de Ifach. Here is every way to get to the door.",
    sedeTitulo: "The venue",
    verMapa: "See it on the map",
    rutaBtn: "Open directions in Google Maps",

    transferTitulo: "Transfers from Alicante",
    transferLead: "Transfers are run by Beniconnect, a Costa Blanca travel agency. You book the trip to the hotel door with them: it's the easiest option if you arrive by plane or train.",
    transferAvion: "From Alicante airport",
    transferAvionTxt: "For arrivals and departures between 7:00 and 23:55.",
    transferTren: "From Alicante train station",
    transferTrenTxt: "For arrivals and departures between 9:00 and 20:15.",
    transferNota: "When booking, choose Calpe as your destination and give the Hotel AR Diamante Beach. Prices, timetables and the confirmation are handled by Beniconnect.",
    transferBtn: "Book with Beniconnect ↗",

    avionTitulo: "By plane",
    avionAlc: "Alicante-Elche (ALC)",
    avionAlcTxt: "About 50 minutes from the hotel. It's the festival's natural airport and the one almost everyone uses.",
    avionVlc: "Valencia (VLC)",
    avionVlcTxt: "1 h 20 min from the hotel. A good alternative if you find a better flight.",

    busTitulo: "By bus",
    busTxt: "ALSA runs a direct line between Alicante airport and Calpe; the trip takes around two hours. There are also services from Alicante bus station and from Valencia and Benidorm. Timetables change with the season, so check the day you travel.",
    busBtn: "ALSA timetables",

    tramTitulo: "By tram",
    tramTxt: "TRAM line 9, between Benidorm and Dénia, stops in Calpe. From the city of Alicante you take line 1 to Benidorm and change to line 9 there. It's a lovely ride along the coast, but it runs every one or two hours: check the timetable in advance and don't leave it to the last minute.",
    tramBtn: "TRAM timetables",

    cocheTitulo: "By car",
    cocheTxt: "Take the AP-7 toll motorway, exit 64, Altea/Calpe. The N-332 is the free alternative and runs along the coast: a little slower, but the views make up for it. The hotel has parking.",
    cocheBtn: "Open directions in Google Maps",

    dudasTitulo: "Still have a question?",
    dudasTxt: "Write to us and we'll help you plan your arrival.",
    dudasBtn: "Contact",
  },

  it: {
    ruta: "/it/come-arrivare/",
    metaTitle: "Come arrivare a La Negra Dance Festival · Calpe, Alicante",
    metaDesc:
      "Come raggiungere l'Hotel AR Diamante Beach di Calpe: aeroporti, servizio di transfer, autobus, tram e auto. Tutto in un unico posto.",
    eyebrow: "Dove ci vediamo",
    h1: "Come arrivare",
    lead: "Tutto il festival si svolge nello stesso posto: l'Hotel AR Diamante Beach di Calpe, sul lungomare ai piedi del Peñón de Ifach. Qui trovi tutti i modi per arrivare fino alla porta.",
    sedeTitulo: "La sede",
    verMapa: "Vedi sulla mappa",
    rutaBtn: "Apri il percorso su Google Maps",

    transferTitulo: "Il transfer da Alicante",
    transferLead: "I trasferimenti sono gestiti da Beniconnect, un'agenzia della Costa Blanca. Prenoti con loro il tragitto fino alla porta dell'hotel: è la soluzione più comoda se arrivi in aereo o in treno.",
    transferAvion: "Dall'aeroporto di Alicante",
    transferAvionTxt: "Per arrivi e partenze tra le 7:00 e le 23:55.",
    transferTren: "Dalla stazione ferroviaria di Alicante",
    transferTrenTxt: "Per arrivi e partenze tra le 9:00 e le 20:15.",
    transferNota: "Al momento della prenotazione scegli Calpe come destinazione e indica l'Hotel AR Diamante Beach. Prezzi, orari e conferma li gestisce Beniconnect.",
    transferBtn: "Prenota su Beniconnect ↗",

    avionTitulo: "In aereo",
    avionAlc: "Alicante-Elche (ALC)",
    avionAlcTxt: "A circa 50 minuti dall'hotel. È l'aeroporto naturale del festival e quello che usano quasi tutti.",
    avionVlc: "Valencia (VLC)",
    avionVlcTxt: "A 1 h 20 min dall'hotel. Buona alternativa se trovi un volo migliore.",

    busTitulo: "In autobus",
    busTxt: "ALSA ha una linea diretta tra l'aeroporto di Alicante e Calpe; il viaggio dura circa due ore. Ci sono anche collegamenti dalla stazione degli autobus di Alicante e da Valencia e Benidorm. Gli orari cambiano con la stagione, quindi controlla il giorno del tuo viaggio.",
    busBtn: "Orari di ALSA",

    tramTitulo: "In tram",
    tramTxt: "La linea 9 del TRAM, tra Benidorm e Dénia, ferma a Calpe. Dalla città di Alicante si prende la linea 1 fino a Benidorm e lì si cambia con la 9. È un viaggio bellissimo lungo la costa, ma passa ogni una o due ore: meglio guardare l'orario prima e non ridursi all'ultimo momento.",
    tramBtn: "Orari del TRAM",

    cocheTitulo: "In auto",
    cocheTxt: "Dalla AP-7 (autostrada a pedaggio), uscita 64, Altea/Calpe. La N-332 è l'alternativa gratuita e costeggia il mare: si impiega un po' di più, ma il paesaggio ripaga. L'hotel ha parcheggio.",
    cocheBtn: "Apri il percorso su Google Maps",

    dudasTitulo: "Hai ancora qualche dubbio?",
    dudasTxt: "Scrivici e ti aiutiamo a organizzare l'arrivo.",
    dudasBtn: "Contatti",
  },
};
