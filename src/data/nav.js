// Navegación principal y datos de footer (ES / EN)

export const MENU = {
  es: [
    { label: "COMPETICIÓN", href: "/competicion/", sub: [
      { t: "INSCRIPCIÓN", h: "/competicion/#inscripcion" },
      { t: "BASES COMPETICIÓN", h: "/competicion/#bases" },
      { t: "PASE COMPETICIÓN", h: "/competicion/#fullpass" },
      { t: "COMPETIDORES", h: "/competidores/" },
      { t: "VIDEOS COMPETIDORES", h: "https://www.youtube.com/c/LaNegraDanceFestival/playlists" },
      { t: "GANADORES 2025", h: "/ganadores-2025/" },
      { t: "GANADORES 2024", h: "/ganadores/" },
    ]},
    { label: "FESTIVAL", href: "/festival/", sub: [
      { t: "FESTIVAL", h: "/festival/#info" },
      { t: "ARTISTAS", h: "/festival/#artistas" },
      { t: "TALLERES", h: "/festival/#talleres" },
      { t: "FULL PASS", h: "/festival/#fullpass" },
      { t: "HOTEL", h: "/festival/#hotel" },
      { t: "CONTACTAR", h: "/festival/#contactar" },
    ]},
    { label: "RESERVA HOTEL", href: "https://ar-hotels.actpages.com/la-negra-festival.html", sub: [] },
    { label: "ARTISTAS", href: "/artistas/", sub: [] },
    { label: "TALLERES", href: "/talleres/", sub: [] },
    { label: "FIESTA", href: "/fiesta/", sub: [] },
    { label: "COMPETIDORES", href: "/competidores/", sub: [] },
    { label: "GANADORES", href: "#", sub: [
      { t: "GANADORES 2025", h: "/ganadores-2025/" },
      { t: "GANADORES 2024", h: "/ganadores/" },
    ]},
    { label: "FOTOS", href: "#", sub: [
      { t: "FOTOS 2024", h: "/galeria-2024/" },
      { t: "FOTOS 2023", h: "/galeria-2023/" },
    ]},
  ],
  en: [
    { label: "COMPETITION", href: "/en/competition/", sub: [
      { t: "REGISTRATION", h: "/en/competition/#registration" },
      { t: "COMPETITION RULES", h: "/en/competition/#rules" },
      { t: "PASS COMPETITORS", h: "/en/competition/#fullpass" },
      { t: "COMPETITORS", h: "/en/competitors/" },
      { t: "COMPETING VIDEOS", h: "https://www.youtube.com/c/LaNegraDanceFestival/playlists" },
      { t: "WINNERS 2025", h: "/en/winners-2025/" },
      { t: "WINNERS 2024", h: "/en/winners/" },
    ]},
    { label: "FESTIVAL", href: "/en/festival/", sub: [
      { t: "FESTIVAL", h: "/en/festival/#info" },
      { t: "ARTISTS", h: "/en/festival/#artists" },
      { t: "WORKSHOPS", h: "/en/festival/#workshops" },
      { t: "FULL PASS", h: "/en/festival/#fullpass" },
      { t: "HOTEL", h: "/en/festival/#hotel" },
      { t: "CONTACT", h: "/en/festival/#contact" },
    ]},
    { label: "HOTEL BOOKING", href: "https://ar-hotels.actpages.com/la-negra-festival.html", sub: [] },
    { label: "ARTISTS", href: "/en/artists/", sub: [] },
    { label: "WORKSHOPS", href: "/en/workshops/", sub: [] },
    { label: "PARTY", href: "/en/fiesta/", sub: [] },
    { label: "COMPETITORS", href: "/en/competitors/", sub: [] },
    { label: "WINNERS", href: "#", sub: [
      { t: "WINNERS 2025", h: "/en/winners-2025/" },
      { t: "WINNERS 2024", h: "/en/winners/" },
    ]},
    { label: "GALLERIES", href: "#", sub: [
      { t: "GALLERY 2024", h: "/en/gallery-2024/" },
      { t: "GALLERY 2023", h: "/en/gallery-2023/" },
    ]},
  ],
};

// Conmutador de idioma (apunta al otro idioma)
export const LANG_SWITCH = {
  es: { label: "EN", href: "/en/" },
  en: { label: "ES", href: "/" },
};

export const CTA = {
  es: { label: "Compra tu pase", href: "/tu-pase/" },
  en: { label: "Buy your pass", href: "/en/your-pass/" },
};

export const FOOTER_LEGAL = {
  es: [
    { t: "Aviso Legal", h: "/aviso-legal/" },
    { t: "Política de privacidad", h: "/politica-de-privacidad/" },
    { t: "Política de cookies", h: "/cookies/" },
  ],
  en: [
    { t: "Legal Notice", h: "/en/legal-notice/" },
    { t: "Privacy Policy", h: "/en/privacy-policy/" },
    { t: "Cookie Policy", h: "/en/cookie-policy/" },
  ],
};

export const FOOTER_SOCIAL_TITLE = {
  es: "Síguenos en nuestras redes",
  en: "Follow us on social media",
};

export const HOME_HREF = { es: "/", en: "/en/" };
