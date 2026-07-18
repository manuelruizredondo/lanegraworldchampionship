// Navegación principal y datos de footer (ES / EN / IT)

export const MENU = {
  es: [
    { label: "MUNDIAL", href: "/mundial/", sub: [
      { t: "EL MUNDIAL", h: "/mundial/" },
      { t: "INSCRIPCIÓN", h: "/competicion/#inscripcion" },
      { t: "BASES Y REGLAMENTO", h: "/bases-y-reglamento/" },
      { t: "PASE COMPETIDOR", h: "/tu-pase/" },
      { t: "VÍDEOS", h: "/videos/" },
      { t: "EDICIONES ANTERIORES", h: "/ediciones/", sep: true },
    ]},
    { label: "FESTIVAL", href: "/festival/", sub: [
      { t: "EL FESTIVAL", h: "/festival/#info" },
      { t: "ARTISTAS", h: "/artistas/" },
      { t: "TALLERES", h: "/talleres/" },
      { t: "FIESTA", h: "/fiesta/" },
      { t: "FULL PASS", h: "/tu-pase/" },
      { t: "HOTEL", h: "https://ar-hotels.actpages.com/la-negra-festival.html" },
    ]},
    { label: "GALERÍA", href: "/galeria/", sub: [
      { t: "FOTOS 2024", h: "/galeria-2024/" },
      { t: "FOTOS 2023", h: "/galeria-2023/" },
    ]},
    { label: "CONTACTO", href: "/festival/#contactar", sub: [] },
  ],
  en: [
    { label: "WORLD CUP", href: "/en/world-championship/", sub: [
      { t: "THE CHAMPIONSHIP", h: "/en/world-championship/" },
      { t: "REGISTRATION", h: "/en/competition/#registration" },
      { t: "RULES", h: "/en/competition-rules/" },
      { t: "COMPETITOR PASS", h: "/en/your-pass/" },
      { t: "VIDEOS", h: "/en/videos/" },
      { t: "PAST EDITIONS", h: "/en/editions/", sep: true },
    ]},
    { label: "FESTIVAL", href: "/en/festival/", sub: [
      { t: "THE FESTIVAL", h: "/en/festival/#info" },
      { t: "ARTISTS", h: "/en/artists/" },
      { t: "WORKSHOPS", h: "/en/workshops/" },
      { t: "PARTY", h: "/en/fiesta/" },
      { t: "FULL PASS", h: "/en/your-pass/" },
      { t: "HOTEL", h: "https://ar-hotels.actpages.com/la-negra-festival.html" },
    ]},
    { label: "GALLERY", href: "/en/gallery/", sub: [
      { t: "PHOTOS 2024", h: "/en/gallery-2024/" },
      { t: "PHOTOS 2023", h: "/en/gallery-2023/" },
    ]},
    { label: "CONTACT", href: "/en/festival/#contact", sub: [] },
  ],
  it: [
    { label: "MONDIALE", href: "/it/mondiale/", sub: [
      { t: "IL MONDIALE", h: "/it/mondiale/" },
      { t: "ISCRIZIONE", h: "/it/competition/#registration" },
      { t: "REGOLAMENTO", h: "/it/regolamento/" },
      { t: "PASS CONCORRENTE", h: "/it/your-pass/" },
      { t: "VIDEO", h: "/it/videos/" },
      { t: "EDIZIONI PRECEDENTI", h: "/it/edizioni/", sep: true },
    ]},
    { label: "FESTIVAL", href: "/it/festival/", sub: [
      { t: "IL FESTIVAL", h: "/it/festival/#info" },
      { t: "ARTISTI", h: "/it/artists/" },
      { t: "WORKSHOP", h: "/it/workshops/" },
      { t: "FESTA", h: "/it/fiesta/" },
      { t: "FULL PASS", h: "/it/your-pass/" },
      { t: "HOTEL", h: "https://ar-hotels.actpages.com/la-negra-festival.html" },
    ]},
    { label: "GALLERIA", href: "/it/gallery/", sub: [
      { t: "FOTO 2024", h: "/it/gallery-2024/" },
      { t: "FOTO 2023", h: "/it/gallery-2023/" },
    ]},
    { label: "CONTATTI", href: "/it/festival/#contact", sub: [] },
  ],
};

// Selector de idioma: enlaza a la home de cada idioma; el header resalta el activo
export const LANGUAGES = [
  { code: "es", label: "ES", name: "Español", home: "/" },
  { code: "en", label: "EN", name: "English", home: "/en/" },
  { code: "it", label: "IT", name: "Italiano", home: "/it/" },
];

export const CTA = {
  es: { label: "Compra tu pase", href: "/tu-pase/" },
  en: { label: "Buy your pass", href: "/en/your-pass/" },
  it: { label: "Acquista il pass", href: "/it/your-pass/" },
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
  it: [
    { t: "Note legali", h: "/it/legal-notice/" },
    { t: "Informativa sulla privacy", h: "/it/privacy-policy/" },
    { t: "Informativa sui cookie", h: "/it/cookie-policy/" },
  ],
};

export const FOOTER_SOCIAL_TITLE = {
  es: "Síguenos en nuestras redes",
  en: "Follow us on social media",
  it: "Seguici sui social",
};

export const FOOTER_COPYRIGHT = {
  es: "Todos los derechos reservados",
  en: "All rights reserved",
  it: "Tutti i diritti riservati",
};

export const FOOTER_DESIGNED_BY = {
  es: "Diseñado por",
  en: "Designed by",
  it: "Progettato da",
};

export const HOME_HREF = { es: "/", en: "/en/", it: "/it/" };

// Banner de consentimiento de cookies (GA4 solo se carga si el usuario acepta)
export const COOKIES_BANNER = {
  es: { text: "Usamos cookies de análisis (Google Analytics) para entender cómo se usa la web. Puedes aceptarlas o rechazarlas.", accept: "Aceptar", reject: "Rechazar", more: "Más info", moreUrl: "/cookies/" },
  en: { text: "We use analytics cookies (Google Analytics) to understand how the site is used. You can accept or decline them.", accept: "Accept", reject: "Decline", more: "Learn more", moreUrl: "/en/cookie-policy/" },
  it: { text: "Usiamo cookie di analisi (Google Analytics) per capire come viene usato il sito. Puoi accettarli o rifiutarli.", accept: "Accetta", reject: "Rifiuta", more: "Maggiori info", moreUrl: "/it/cookie-policy/" },
};

// Newsletter (formulario de Netlify Forms en el footer)
export const NEWSLETTER = {
  es: { title: "No te pierdas nada", sub: "Line-up, entradas y sorpresas de La Negra, antes que nadie.", ph: "Tu email", btn: "Suscribirme", consent1: "Acepto la ", consentLink: "política de privacidad", consentUrl: "/politica-de-privacidad/", ok: "¡Gracias! Te avisaremos de las novedades.", err: "Ups, algo falló. Inténtalo de nuevo." },
  en: { title: "Don't miss a thing", sub: "Line-up, tickets and surprises from La Negra, before anyone else.", ph: "Your email", btn: "Subscribe", consent1: "I accept the ", consentLink: "privacy policy", consentUrl: "/en/privacy-policy/", ok: "Thanks! We'll keep you posted.", err: "Oops, something went wrong. Try again." },
  it: { title: "Non perderti nulla", sub: "Line-up, biglietti e sorprese di La Negra, prima di tutti.", ph: "La tua email", btn: "Iscriviti", consent1: "Accetto la ", consentLink: "privacy policy", consentUrl: "/it/privacy-policy/", ok: "Grazie! Ti terremo aggiornato.", err: "Ops, qualcosa è andato storto. Riprova." },
};
