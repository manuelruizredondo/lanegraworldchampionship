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
    entrar: "Entrar",
    salir: "Salir",
    miCuenta: "Mi cuenta",
    google: "Continuar con Google",
    oEmail: "o con tu email",
    errGoogle: "No se ha podido entrar con Google. Prueba con el email.",
    titulo: "Entra con tu email",
    lead: "Te mandamos un enlace al correo. Sin contraseñas: pulsas y entras.",
    email: "Tu email",
    enviar: "Enviarme el enlace",
    enviando: "Enviando…",
    enviado: "Mira tu correo: te hemos mandado un enlace para entrar. Puede tardar un minuto.",
    errEmail: "Escribe un email válido.",
    errEnvio: "No se ha podido enviar el enlace. Inténtalo en un momento.",
    cerrar: "Cerrar",
    sesionDe: "Sesión iniciada como",
    nota: "Solo usamos tu email para identificarte. No lo publicamos ni lo cedemos.",
  },
  en: {
    entrar: "Sign in",
    salir: "Sign out",
    miCuenta: "My account",
    google: "Continue with Google",
    oEmail: "or with your email",
    errGoogle: "Couldn't sign in with Google. Try with your email.",
    titulo: "Sign in with your email",
    lead: "We'll email you a link. No passwords: tap it and you're in.",
    email: "Your email",
    enviar: "Send me the link",
    enviando: "Sending…",
    enviado: "Check your inbox: we've sent you a sign-in link. It may take a minute.",
    errEmail: "Please enter a valid email.",
    errEnvio: "We couldn't send the link. Please try again in a moment.",
    cerrar: "Close",
    sesionDe: "Signed in as",
    nota: "We only use your email to identify you. We don't publish or share it.",
  },
  it: {
    entrar: "Accedi",
    salir: "Esci",
    miCuenta: "Il mio account",
    google: "Continua con Google",
    oEmail: "oppure con la tua email",
    errGoogle: "Non è stato possibile accedere con Google. Prova con l'email.",
    titulo: "Accedi con la tua email",
    lead: "Ti mandiamo un link via email. Senza password: lo tocchi ed entri.",
    email: "La tua email",
    enviar: "Mandami il link",
    enviando: "Invio…",
    enviado: "Controlla la posta: ti abbiamo mandato un link per entrare. Può volerci un minuto.",
    errEmail: "Inserisci un'email valida.",
    errEnvio: "Non siamo riusciti a inviare il link. Riprova tra un momento.",
    cerrar: "Chiudi",
    sesionDe: "Sessione di",
    nota: "Usiamo la tua email solo per identificarti. Non la pubblichiamo né la cediamo.",
  },
};
