// Conexión del navegador con Supabase.
//
// Estas dos claves son PÚBLICAS a propósito: van en el HTML y cualquiera puede
// verlas. No dan acceso a nada por sí solas, porque todas las tablas llevan RLS
// con políticas: cada cuenta solo alcanza sus propias filas, y los resultados
// de la votación solo los ve quien tenga rol de admin.
//
// La clave que SÍ es secreta (service_role) vive únicamente en las variables de
// entorno de Netlify y nunca llega al navegador.
export const SUPABASE_URL = "https://jvjszigmxyahdudjsujn.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_OLMQct7al2a7JPns9jGr4g_Nfs-kwvl";

// La librería se carga desde CDN solo cuando alguien va a usar la cuenta, para
// no meter 40 KB a todo el que entra a mirar el horario.
export const SUPABASE_CDN = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.47.10/+esm";

export const CUENTA_I18N = {
  es: {
    entrar: "Iniciar sesión",
    salir: "Salir",
    miCuenta: "Mi cuenta",
    google: "Continuar con Google",
    errGoogle: "No se ha podido entrar con Google. Inténtalo de nuevo en un momento.",
    titulo: "Inicia sesión",
    lead: "Entra con tu cuenta de Google para guardar tus favoritos y recuperarlos en cualquier móvil.",
    cerrar: "Cerrar",
    sesionDe: "Sesión iniciada como",
    nota: "Solo usamos tu email para identificarte. No lo publicamos ni lo cedemos.",
    privacidad: "Política de privacidad",
    rutaPrivacidad: "/politica-de-privacidad/",
  },
  en: {
    entrar: "Sign in",
    salir: "Sign out",
    miCuenta: "My account",
    google: "Continue with Google",
    errGoogle: "Couldn't sign in with Google. Please try again in a moment.",
    titulo: "Sign in",
    lead: "Sign in with your Google account to save your favourites and get them back on any phone.",
    cerrar: "Close",
    sesionDe: "Signed in as",
    nota: "We only use your email to identify you. We don't publish or share it.",
    privacidad: "Privacy policy",
    rutaPrivacidad: "/en/privacy-policy/",
  },
  it: {
    entrar: "Accedi",
    salir: "Esci",
    miCuenta: "Il mio account",
    google: "Continua con Google",
    errGoogle: "Non è stato possibile accedere con Google. Riprova tra un momento.",
    titulo: "Accedi",
    lead: "Accedi con il tuo account Google per salvare i preferiti e ritrovarli su qualsiasi telefono.",
    cerrar: "Chiudi",
    sesionDe: "Sessione di",
    nota: "Usiamo la tua email solo per identificarti. Non la pubblichiamo né la cediamo.",
    privacidad: "Informativa sulla privacy",
    rutaPrivacidad: "/it/privacy-policy/",
  },
};

// Escritorio de la cuenta (/cuenta/, /en/account/, /it/account/).
export const PANEL_I18N = {
  es: {
    ruta: "/cuenta/",
    eyebrow: "Tu cuenta",
    titulo: "Mi cuenta",
    sesionDe: "Sesión iniciada como",
    salir: "Cerrar sesión",
    sinSesion: "Entra con tu cuenta para ver esta página.",
    cargando: "Un momento…",
    admin: "Tienes permiso de organización: aquí abajo están los datos del festival.",
    favTitulo: "Tus talleres favoritos",
    favLead: "Lo que has marcado en la programación. Se guarda en tu cuenta, así que lo tienes en cualquier móvil.",
    favVacio: "Todavía no has marcado ninguno.",
    verPrograma: "Ver la programación",
    colSesion: "Sesión",
    colDia: "Día",
    colSala: "Sala",
  },
  en: {
    ruta: "/en/account/",
    eyebrow: "Your account",
    titulo: "My account",
    sesionDe: "Signed in as",
    salir: "Sign out",
    sinSesion: "Sign in to see this page.",
    cargando: "One moment…",
    admin: "You have organisation access: the festival data is below.",
    favTitulo: "Your favourite workshops",
    favLead: "What you marked on the programme. It is saved to your account, so you have it on any phone.",
    favVacio: "You haven't marked any yet.",
    verPrograma: "See the programme",
    colSesion: "Session",
    colDia: "Day",
    colSala: "Room",
  },
  it: {
    ruta: "/it/account/",
    eyebrow: "Il tuo account",
    titulo: "Il mio account",
    sesionDe: "Sessione di",
    salir: "Esci",
    sinSesion: "Accedi per vedere questa pagina.",
    cargando: "Un momento…",
    admin: "Hai i permessi dell'organizzazione: qui sotto trovi i dati del festival.",
    favTitulo: "I tuoi workshop preferiti",
    favLead: "Quello che hai segnato nel programma. È salvato nel tuo account, così ce l'hai su qualsiasi telefono.",
    favVacio: "Non ne hai ancora segnato nessuno.",
    verPrograma: "Vedi il programma",
    colSesion: "Sessione",
    colDia: "Giorno",
    colSala: "Sala",
  },
};
