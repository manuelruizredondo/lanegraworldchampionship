// Vídeos del Mundial: los campeones (1er puesto) de cada categoría, edición por edición.
// Canal de YouTube oficial + listado de vídeos ganadores.
// Cada entrada: { year, category, name, id }  (id = parte final de la URL de YouTube).

export const VIDEOS_CHANNEL = "https://www.youtube.com/@LaNegraDanceFestival/videos";

export const VIDEOS_META = {
  es: {
    eyebrow: "El Mundial",
    h1: "Vídeos del Mundial",
    sub: "Revive las actuaciones ganadoras del Mundial de Pasos Libres: los campeones de cada categoría, edición por edición.",
    channelBtn: "Ver el canal en YouTube",
    emptyNote: "Muy pronto publicaremos aquí los vídeos del pódium. Mientras tanto, puedes verlos en nuestro canal de YouTube.",
    edition: (y) => `Mundial ${y}`,
    winner: "Campeón/a",
  },
  en: {
    eyebrow: "The World Championship",
    h1: "Championship videos",
    sub: "Relive the winning performances of the Pasos Libres World Championship: the champions of each category, edition by edition.",
    channelBtn: "Visit our YouTube channel",
    emptyNote: "We'll post the podium videos here very soon. In the meantime, you can watch them on our YouTube channel.",
    edition: (y) => `${y} World Cup`,
    winner: "Champion",
  },
  it: {
    eyebrow: "Il Mondiale",
    h1: "Video del Mondiale",
    sub: "Rivivi le esibizioni vincitrici del Mondiale Pasos Libres: i campioni di ogni categoria, edizione per edizione.",
    channelBtn: "Vai al canale YouTube",
    emptyNote: "Pubblicheremo qui a breve i video del podio. Nel frattempo, puoi guardarli sul nostro canale YouTube.",
    edition: (y) => `Mondiale ${y}`,
    winner: "Campione",
  },
};

export const VIDEOS = [
  // ---- 2025 ----
  { year: 2025, category: "Pareja Salsa", name: "Jesús y Camila", id: "TUFubWQOgFs" },
  { year: 2025, category: "Pareja Bachata", name: "Gon y Bella", id: "-O1sVP7ASuo" },
  { year: 2025, category: "Solista Chicos Salsa", name: "Juan Racines", id: "miCYW_PNOaE" },
  { year: 2025, category: "Dúo Chicas Salsa", name: "Ayelén y Vanessa", id: "0RpZVwFb7wM" },
  { year: 2025, category: "Solista Chicas Salsa", name: "Ariamna Aguilera", id: "HhvNCAAo5Fg" },
  { year: 2025, category: "Solista Chica Bachata", name: "Polina Rybakova", id: "cS6UC6uahVg" },
  { year: 2025, category: "Dúos Mixtos Bachata", name: "Reyes y Rocío", id: "Sgsjp_bB4Fc" },
  { year: 2025, category: "Dúo Chicos Salsa", name: "Juan y Andrés", id: "7ju7GYSNGXg" },
  { year: 2025, category: "Solista Chico Bachata", name: "Erick Hoggins", id: "jld6GWFUHVQ" },
  { year: 2025, category: "Grupo Bachata", name: "Otra Vaina", id: "hCCYsXs8bqI" },
  { year: 2025, category: "Grupo Salsa", name: "One Drop", id: "L4njOAaO-WQ" },

  // ---- 2024 ----
  { year: 2024, category: "Parejas Salsa", name: "Tony El Haber y Sheida Shahroozi", id: "9_ZQvdLh7Pk" },
  { year: 2024, category: "Bachata All Styles Parejas", name: "Micaela Calamante y Francisco Moretto", id: "ix8ecrqVRNc" },
  { year: 2024, category: "Grupos Bachata All Styles", name: "Latin Attitude (Filipa y Pedro)", id: "ydB8U8nAseY" },
  { year: 2024, category: "Grupos Salsa", name: "Mambo a lo Ayala (Hnos. Ayala)", id: "jRtHgz_AWBs" },
  { year: 2024, category: "Solista Chicos Salsa", name: "Tony El Haber", id: "6vWxGDpG4cQ" },
  { year: 2024, category: "Dúos Chicas Salsa", name: "Federica y Miriam", id: "UndZHNhtKF8" },
  { year: 2024, category: "Solistas Chicas Bachata", name: "Paula Lozano", id: "mZRIGD0KS-8" },
  { year: 2024, category: "Solistas Chicas Salsa", name: "Yaiza Melero", id: "VNKEAmRJYgU" },
  { year: 2024, category: "Dúos Chicos Salsa", name: "Jarno y Matías", id: "rOHg6UzbyM0" },
  { year: 2024, category: "Solistas Chicos Bachata", name: "Juan Camilo Rojas Grisales", id: "cO0t1H46Jgk" },

  // ---- 2023 ----
  { year: 2023, category: "Equipos Bachata", name: "E Motion Dance Company (Berra y Laura)", id: "LM9HXV-C58g" },
  { year: 2023, category: "Parejas Salsa", name: "Tony y Sheida", id: "JARtNApNUbY" },
  { year: 2023, category: "Solista Femenina Bachata", name: "Mabel Oriola", id: "WTMLW097HBg" },
  { year: 2023, category: "Parejas Bachata", name: "Raúl y Reyes", id: "lnB4JTZTYA0" },
  { year: 2023, category: "Equipo Salsa", name: "Fuego en la Pista (Enrique Jarquín)", id: "65nyLu8jRhY" },
  { year: 2023, category: "Solista Masculino Bachata", name: "Juan Camilo Rojas", id: "1zngXzJGiis" },
  { year: 2023, category: "Solista Femenino Salsa", name: "Yolieth Barragán", id: "g-Zz_QAd5QI" },
  { year: 2023, category: "Solista Masculino Salsa", name: "Bryan de la Pava", id: "NaauRFYfBBE" },
  { year: 2023, category: "Dúo Femenino", name: "Federica y Miriam", id: "CX5-XtWTLa0" },
  { year: 2023, category: "Dúo Masculino", name: "Edson Blanco y Juan Parra", id: "6uhv1Nv146I" },

  // ---- 2022 ----
  { year: 2022, category: "Solista Masculino · I Mundial Bachata", name: "Jorge El Bomba", id: "9SJH9_zAZ-U" },
  { year: 2022, category: "Solista Femenina · I Mundial Bachata", name: "María Baeva", id: "bIj2ksCLSsc" },
  { year: 2022, category: "Grupos · I Mundial Bachata", name: "Majao Project", id: "NrA0PRC7Htg" },
  { year: 2022, category: "Solista Femenina · XI Mundial Salsa", name: "Xiomar Rivas", id: "CBu0-VUssvY" },
  { year: 2022, category: "Dúo Masculino · XI Mundial Salsa", name: "Pinuzzo y Edoardo", id: "BS72Suj-yWQ" },
  { year: 2022, category: "Solista Masculino · XI Mundial Salsa", name: "Juan Camilo Diago", id: "d-iiX8ZWXBg" },
  { year: 2022, category: "Dúo Femenino · XI Mundial Salsa", name: "Katty y Damaris Lima", id: "Ngfc7GancbE" },
  { year: 2022, category: "Equipos · XI Mundial Salsa", name: "Cía. Eivynd y Daniel", id: "BXpuSYTzvBo" },

  // ---- 2019 ----
  { year: 2019, category: "Grupos", name: "Full Project Company", id: "9Tf0Bpjb0HA" },
  { year: 2019, category: "Dúo Masculino", name: "Eivynd y Daniel (Venezuela)", id: "zqn3FQRracI" },
  { year: 2019, category: "Solistas Masculino", name: "Pinuzzo Caggiano (Italia)", id: "OqcIUvb68i0" },
  { year: 2019, category: "Solistas Femenino", name: "Jessica Patella", id: "vILujTmXipY" },

  // ---- 2018 ----
  { year: 2018, category: "Dúo Masculino", name: "Brandon y Benny", id: "PaF47Aijp2E" },
  { year: 2018, category: "Solista Femenino", name: "Jessica Patella", id: "RkY0TKxpPN0" },
  { year: 2018, category: "Solista Masculino", name: "Bruno Rodríguez", id: "-TzcINz-QUE" },
  { year: 2018, category: "Dúo Femenino", name: "Gabriela Morales e Idalines Medina", id: "A8h9y-aCNWc" },
];
