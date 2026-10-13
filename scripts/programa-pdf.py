#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera public/pdf/programacion-la-negra-2026.pdf a partir de src/data/programa.js.

El PDF NO se regenera solo: hay que lanzar este script cada vez que cambie
PROGRAMA. Desde la raíz del proyecto:

    node scripts/programa-datos.mjs /tmp/programa.json
    PYTHONPATH=<ruta-a-reportlab> python3 scripts/programa-pdf.py /tmp/programa.json

Genera los tres PDF de una vez (es/en/it) en public/pdf/.

COLORES: son los del documento maestro del Drive (el .docx de la organización),
no los de la web. Cada sesión toma el relleno EXACTO de su celda en el documento,
leído de scripts/colores-drive.json. Para lo que no esté en esa tabla (sesiones
nuevas, o filas que el documento no colorea) se aplica la regla de PALETA, que
reproduce el mismo criterio: tipo de sesión y, en los talleres, nivel.

Si la organización recolorea el documento, regenera la tabla volviendo a leer
los rellenos de word/document.xml y vuelve a lanzar este script.
"""
import colorsys
import json
import os
import re
import sys

from reportlab.lib.colors import Color
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (BaseDocTemplate, Frame, PageTemplate, Paragraph,
                                Spacer, Table, TableStyle)


def rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def oscurece(c, f=0.72):
    return tuple(v * f for v in c)


# ── Paleta del documento del Drive ───────────────────────────────────────────
# (fondo, tinta del texto). La tinta es blanca solo en los fondos oscuros.
NEGRO = rgb("14121a")
BLANCO = (1, 1, 1)

PALETA = {
    "taller-Abierto":    (rgb("d9ead3"), NEGRO),   # verde claro
    "taller-Medio":      (rgb("cfe2f3"), NEGRO),   # azul claro
    "taller-Medio-Alto": (rgb("f4cccc"), NEGRO),   # rosa claro
    "master":            (rgb("fff2cc"), NEGRO),   # amarillo claro
    "ciclo":             (rgb("0b5394"), BLANCO),  # azul oscuro · Ciclo Crecimiento Profesional
    "comp-bachata":      (rgb("f1e6f6"), NEGRO),   # lila
    "comp-bachata-duos": (rgb("d9d2e9"), NEGRO),   # lila más saturado · Dúos Mixtos
    "comp-salsa":        (rgb("fce8eb"), NEGRO),   # rosa
    "social":            (rgb("3a3a3a"), BLANCO),  # gris oscuro · baile social nocturno
    "social-dirigido":   (rgb("ffff00"), NEGRO),   # amarillo fuerte
    "concierto":         (rgb("00ffff"), NEGRO),   # cian · Dani J
    "meal":              (rgb("ededed"), NEGRO),   # gris claro · comidas
    "info":              (rgb("f7f7f7"), NEGRO),
}
# Colores de TEXTO del documento (no solo el relleno): el rótulo de cada
# tarjeta, el nivel y el nombre del profesor van en su propio color.
TINTA_TITULO = rgb("1a1a1a")
TINTA_PROFE = rgb("6b6b6b")
TINTA_NIVEL = rgb("b3122e")
# Color de cada rótulo; el texto lo pone el idioma (scripts/programa-datos.mjs).
ROTULO_COLOR = {
    "master": ("master", rgb("b3122e")),
    "ciclo": ("ciclo", rgb("ffff00")),
    "comp-bachata": ("bachata", rgb("7a1fa2")),
    "comp-bachata-duos": ("bachata", rgb("7a1fa2")),
    "comp-salsa": ("salsa", rgb("c8102e")),
}
# En el azul del ciclo el cuerpo del texto va casi blanco.
TINTA_SOBRE_AZUL = rgb("efefef")

CABECERA_TABLA = rgb("1a1a1a")
ROJO_COMIDAS = rgb("b3122e")
ORO = rgb("cc9933")

# Niveles de taller que el documento no colorea: se les da el tono vecino.
VECINO = {"Medio-Bajo": "Medio", "Medio-Avanzado": "Medio-Alto", "Avanzado": "Medio-Alto"}

SALAS = ["gs", "pb", "s1", "s2"]
PDF_POR_IDIOMA = {
    "es": "public/pdf/programacion-la-negra-2026.pdf",
    "en": "public/pdf/schedule-la-negra-2026.pdf",
    "it": "public/pdf/programma-la-negra-2026.pdf",
}

W, H = landscape(A4)
M = 26
TW = 70                       # columna de la hora
CW = (W - 2 * M - TW - 4 * 3) / 4
PAD = 7


# Relleno exacto de cada sesión en el documento del Drive (nombre → hex).
RUTA_COLORES = os.path.join(os.path.dirname(os.path.abspath(__file__)), "colores-drive.json")
try:
    DRIVE = json.load(open(RUTA_COLORES, encoding="utf8"))
except FileNotFoundError:
    DRIVE = {}

# Cambios de color pedidos por el cliente sobre lo que dice el documento.
# Se aplican DESPUÉS de leer colores-drive.json, para que valgan tanto si el
# color viene del documento como si lo calcula la regla.
# Es una permutación: el azul del Ciclo pasa al Mundial Bachata, el amarillo
# del social dirigido pasa al Mundial Salsa y el lila de Bachata pasa al social.
# Se aplica UNA sola vez sobre el color leído, así que no se encadenan.
SUSTITUCIONES = {
    "fce8eb": "ffff00",   # Mundial Salsa  → amarillo fluorescente
    "f1e6f6": "0b5394",   # Mundial Bachata → azul, con letra blanca
    "d9d2e9": "0b5394",   # Bachata Dúos Mixtos → el mismo azul
    "0b5394": "5c1130",   # Ciclo formativo → granate
    "ffff00": "f1e6f6",   # Social dirigido (batey y Korke) → lila claro
    # Masterclass se queda con el amarillo del documento (#fff2cc).
}

# Paleta alternativa con los colores de Google (los del selector de Drive),
# para la propuesta de unificación. Se activa con la variable de entorno
# PALETA=google y escribe en ficheros aparte, para no tocar el PDF publicado.
# La asignación se eligió maximizando la distancia entre categorías: la pareja
# más parecida queda a ΔE 32, muy por encima del umbral de confusión (~9).
SUSTITUCIONES_GOOGLE = {
    "fce8eb": "fbe3a7",   # Mundial Salsa     → amarillo pastel
    "f1e6f6": "bac0e8",   # Mundial Bachata   → azul pastel
    "d9d2e9": "bac0e8",   # Bachata Dúos      → el mismo azul
    "0b5394": "f5adca",   # Ciclo formativo   → granate pastel
    "fff2cc": "fab8a8",   # Masterclass       → naranja pastel
    "ffff00": "e2b3ef",   # Social dirigido   → lila pastel
    "d9ead3": "adf5cb",   # Taller Abierto    → verde pastel
    "cfe2f3": "eaedb5",   # Taller Medio      → lima pastel
    "c9daf8": "eaedb5",   # Taller Medio (variante del documento)
    "f4cccc": "a6dcfc",   # Taller Medio-Alto → azul claro pastel
    "00ffff": "a4fef5",   # Concierto         → turquesa pastel
}

# Rellenos oscuros del documento: ahí el texto va en blanco.
OSCUROS = {"0b5394", "3a3a3a", "1a1a1a", "b3122e", "5c1130",
           # oscuros de la paleta de Google
           "a2144c", "3847ab", "0e7639", "8422a0", "018b7d", "6d4b3d", "cf0000"}

if os.environ.get("PALETA") == "google":
    SUSTITUCIONES = SUSTITUCIONES_GOOGLE
    # Fuera de public/ a propósito: es una propuesta, no se publica hasta que
    # se apruebe. PALETA_SALIDA permite elegir dónde se escribe.
    _d = os.environ.get("PALETA_SALIDA", ".")
    PDF_POR_IDIOMA = {
        "es": _d + "/propuesta-colores-google.pdf",
        "en": _d + "/propuesta-colores-google-en.pdf",
        "it": _d + "/propuesta-colores-google-it.pdf",
    }


def borde_de(fondo):
    """El borde, en el mismo tono que el fondo pero mucho más oscuro.

    Se baja la luminosidad en HLS y se deja la saturación como está: bajando
    el canal RGB a secas el color se ensucia, y subiendo la saturación sale
    un neón en vez del mismo color en versión profunda.
    """
    h, l, sat = colorsys.rgb_to_hls(*fondo)
    return colorsys.hls_to_rgb(h, l * 0.48, sat)


def luminancia(c):
    """Luminancia relativa (WCAG) de un color ya en 0-1."""
    f = lambda v: v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (f(v) for v in c)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contraste(a, b):
    la, lb = luminancia(a), luminancia(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


def legible(fondo, preferido, minimo=4.5):
    """El color pedido si se lee sobre ese fondo; si no, blanco o negro."""
    if contraste(fondo, preferido) >= minimo:
        return preferido
    return BLANCO if contraste(fondo, BLANCO) > contraste(fondo, NEGRO) else NEGRO


def tintas(fondo):
    """Título, texto secundario y nivel, calculados sobre el fondo que toque.

    Antes esto salía de una lista fija de colores «oscuros», que dejaba de
    funcionar en cuanto se cambiaba la paleta: sobre un naranja saturado el
    texto gris se volvía ilegible. Ahora se decide por contraste real.
    """
    sobre_oscuro = contraste(fondo, BLANCO) > contraste(fondo, NEGRO)
    titulo = BLANCO if sobre_oscuro else TINTA_TITULO
    # El secundario (hora, profesor) se acerca al fondo para que pese menos,
    # pero nunca por debajo de 4,5:1, que es el mínimo para texto pequeño.
    # Si ni mezclándolo poco llega, se queda con el color del título.
    mezcla = lambda t: tuple(titulo[i] + (fondo[i] - titulo[i]) * t for i in range(3))
    secundario = titulo
    for t in (0.28, 0.18, 0.08):
        cand = mezcla(t)
        if contraste(fondo, cand) >= 4.5:
            secundario = cand
            break
    nivel = legible(fondo, TINTA_NIVEL)
    return titulo, secundario, nivel


def color_de(s):
    """(fondo, tinta) de la sesión: el del documento si está, si no la regla.

    Se busca por el nombre ESPAÑOL (s["clave"]), que es el que indexa
    colores-drive.json, para que los tres idiomas salgan con el mismo color.
    """
    h = DRIVE.get(s.get("clave") or s.get("n") or "")
    if h:
        h = SUSTITUCIONES.get(h, h)
        return rgb(h), (BLANCO if h in OSCUROS else NEGRO)
    fondo, tinta = PALETA[clave(s)]
    hx = "%02x%02x%02x" % tuple(round(v * 255) for v in fondo)
    if hx in SUSTITUCIONES:
        return rgb(SUSTITUCIONES[hx]), tinta
    return fondo, tinta


def clave(s):
    """Clave de PALETA de la sesión, calculada siempre sobre el texto español."""
    k = s["k"]
    n = s.get("clave") or s.get("n") or ""
    if k == "master":
        return "ciclo" if n.startswith("Ciclo Crecimiento Profesional") else "master"
    if k == "taller":
        lv = s.get("lClave") or "Medio"
        lv = VECINO.get(lv, lv)
        return f"taller-{lv}" if f"taller-{lv}" in PALETA else "taller-Medio"
    if k == "comp":
        if re.match(r"\s*Bachata", n, re.I):
            return "comp-bachata-duos" if "Dúos" in n else "comp-bachata"
        return "comp-salsa"
    if k == "social":
        # El cian del documento es solo para el concierto de Dani J; la banda de
        # la pre-party también dice "concierto" y no debe llevárselo.
        if re.search(r"Dani J", n, re.I):
            return "concierto"
        return "social-dirigido" if "social dirigido" in n.lower() else "social"
    return "meal" if k == "meal" else "info"


def capitaliza(t):
    """«DOMINGO» → «Domingo», «25 OCT» → «25 oct». Solo la inicial en mayúscula."""
    t = (t or "").lower()
    return t[:1].upper() + t[1:] if t[:1].isalpha() else t


def titulo(s):
    """El rótulo ya dice «MUNDIAL BACHATA» o «MASTERCLASS»: el título no lo repite."""
    n = s.get("n") or ""
    k = clave(s)
    if k in ROTULO_COLOR:
        if k.startswith("comp"):
            n = re.sub(r"^(Bachata|Salsa)\s*:\s*", "", n)
        else:
            # Masterclass / Ciclo…: fuera todo lo que precede a los dos puntos.
            n = re.sub(r"^[^:]{0,45}:\s*", "", n, count=1)
        n = n[:1].upper() + n[1:]
    return n


TITULO_PDF = {
    "es": "Programación 2026 · La Negra World Championship",
    "en": "2026 Schedule · La Negra World Championship",
    "it": "Programma 2026 · La Negra World Championship",
}


# ── Medidas del documento del Drive ──────────────────────────────────────────
# El Word es A4 apaisado con márgenes de 720 twips a los lados y 500 arriba y
# abajo. Un twip es 1/20 de punto, así que las medidas salen exactas.
TW_PT = 1 / 20.0
MARGEN_X = 720 * TW_PT          # 36 pt
MARGEN_Y = 500 * TW_PT          # 25 pt
# Anchos de columna del documento: HORA + los cuatro salones.
COLS_TWIPS = [1500, 3500, 3500, 3449, 3449]
COLS = [w * TW_PT for w in COLS_TWIPS]

# Colores del documento
TINTA = rgb("1a1a1a")
GRIS = rgb("6b6b6b")
GRANATE = rgb("b3122e")
LINEA = rgb("d9d9d9")
FONDO_HORA = rgb("f7f7f7")
FONDO_COMIDA = rgb("ededed")
FONDO_CABECERA = rgb("1a1a1a")


def col(c):
    """De la tupla 0-1 que usa el resto del script al color de reportlab."""
    return Color(*c)


def estilo(nombre, tam, color, negrita=False, cursiva=False, **kw):
    fuente = "Helvetica"
    if negrita and cursiva:
        fuente = "Helvetica-BoldOblique"
    elif negrita:
        fuente = "Helvetica-Bold"
    elif cursiva:
        fuente = "Helvetica-Oblique"
    kw.setdefault("leading", tam * 1.22)
    return ParagraphStyle(nombre, fontName=fuente, fontSize=tam, textColor=col(color), **kw)


# Tamaños en puntos: en el Word van en medios puntos (sz 40 = 20 pt).
E_TITULO = estilo("titulo", 20, TINTA, True, alignment=TA_CENTER, leading=23)
E_SUBTITULO = estilo("subtitulo", 11, GRANATE, True, alignment=TA_CENTER, spaceBefore=4)
E_SEDE = estilo("sede", 9, GRIS, alignment=TA_CENTER, spaceBefore=3)
E_LEYENDA = estilo("leyenda", 7, TINTA, spaceBefore=10, leading=10)
E_DIA = estilo("dia", 13, TINTA, True, spaceBefore=12, spaceAfter=6)
E_DESCARGO = estilo("descargo", 6.5, GRIS, cursiva=True, spaceBefore=5, leading=8.5)
E_CIERRE = estilo("cierre", 13, GRANATE, True, alignment=TA_CENTER, spaceBefore=12)
E_CAB_TABLA = estilo("cabtabla", 7, BLANCO, True, alignment=TA_CENTER, leading=9)
E_HORA = estilo("hora", 7.5, TINTA, True, leading=9.5)
E_COMIDA = estilo("comida", 7.5, GRIS, True, leading=9.5)
E_COMIDAS_CAB = estilo("comidascab", 7, BLANCO, True, leading=9)
E_COMIDAS_CEL = estilo("comidascel", 7.5, TINTA, leading=9.5)

TITULO_PDF = {
    "es": "Programación 2026 · La Negra World Championship",
    "en": "2026 Schedule · La Negra World Championship",
    "it": "Programma 2026 · La Negra World Championship",
}

# Encabezados del documento, por idioma. El resto de textos viene de los datos.
PORTADA = {
    "es": ("LA NEGRA WORLD CHAMPIONSHIP & LA NEGRA DANCE FESTIVAL",
           "PROGRAMACIÓN Y HORARIOS",
           "21 al 25 de octubre de 2026  ·  Hotel Diamante Beach, Calpe (España)",
           "¡Nos vemos del 20 al 24 de octubre de 2027!",
           "La Negra World Championship 2026 · Programación",
           "Pág.",
           ("HORARIOS DE COMIDAS · HOTEL", "DESAYUNO", "COMIDA", "CENA",
            "Horario general", "Días especiales"),
           ("DESAYUNO", "COMIDA", "CENA"),
           "Leyenda:", "Niveles de los talleres:"),
    "en": ("LA NEGRA WORLD CHAMPIONSHIP & LA NEGRA DANCE FESTIVAL",
           "PROGRAMME AND SCHEDULE",
           "21–25 October 2026  ·  Hotel Diamante Beach, Calpe (Spain)",
           "See you from 20 to 24 October 2027!",
           "La Negra World Championship 2026 · Programme",
           "P.",
           ("MEAL TIMES · HOTEL", "BREAKFAST", "LUNCH", "DINNER",
            "Usual times", "Special days"),
           ("BREAKFAST", "LUNCH", "DINNER"),
           "Key:", "Workshop levels:"),
    "it": ("LA NEGRA WORLD CHAMPIONSHIP & LA NEGRA DANCE FESTIVAL",
           "PROGRAMMA E ORARI",
           "21–25 ottobre 2026  ·  Hotel Diamante Beach, Calpe (Spagna)",
           "Ci vediamo dal 20 al 24 ottobre 2027!",
           "La Negra World Championship 2026 · Programma",
           "Pag.",
           ("ORARI DEI PASTI · HOTEL", "COLAZIONE", "PRANZO", "CENA",
            "Orario generale", "Giorni speciali"),
           ("COLAZIONE", "PRANZO", "CENA"),
           "Legenda:", "Livelli dei workshop:"),
}


# El documento escribe el mes entero: «MIÉRCOLES 21 DE OCTUBRE».
MES_LARGO = {"es": "de octubre", "en": "October", "it": "ottobre"}


def fecha_larga(fecha, lang):
    m = re.match(r"^\s*(\d{1,2})\s*([A-Za-zÁÉÍÓÚáéíóú.]+)\s*$", fecha or "")
    if not m:
        return fecha
    return f"{m.group(1)} {MES_LARGO.get(lang, MES_LARGO['es'])}"


# El documento escribe «15:30 a 16:45h»; en los otros idiomas, su conector.
CONECTOR = {"es": "a", "en": "to", "it": "alle"}


def hora_texto(t, lang="es"):
    """«15:30 – 16:45» → «15:30 a 16:45h», como lo escribe el documento."""
    t = (t or "").strip()
    m = re.match(r"^(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})$", t)
    if m:
        return f"{m.group(1)} {CONECTOR.get(lang, 'a')} {m.group(2)}h"
    m = re.match(r"^(.*?)(\d{1,2}:\d{2})$", t)
    return f"{t}h" if m else t


def tabla_comidas(P, textos, lang):
    """La tabla resumen de comidas de la cabecera, deducida de los propios datos.

    El documento la trae a mano; aquí se calcula: el horario que más se repite
    es el general y los días que se salen van en «Días especiales». Así no hay
    que mantener dos sitios con la misma información.
    """
    COMIDAS = ("desayuno", "comida", "cena")
    por_comida = {k: [] for k in COMIDAS}
    for d in P:
        for s in d["sessions"]:
            if s.get("k") != "meal":
                continue
            clv = (s.get("clave") or s.get("n") or "").lower()
            for k in COMIDAS:
                if k in clv:
                    por_comida[k].append((capitaliza(d["day"]), s.get("t") or ""))
    generales, especiales = [], []
    for k in COMIDAS:
        filas = por_comida[k]
        if not filas:
            generales.append("—")
            especiales.append("—")
            continue
        cuenta = {}
        for _, t in filas:
            cuenta[t] = cuenta.get(t, 0) + 1
        general = max(cuenta, key=lambda t: cuenta[t])
        generales.append(hora_texto(general, lang))
        raros = [f"{dia}: {hora_texto(t, lang)}" for dia, t in filas if t != general]
        especiales.append(" · ".join(raros) if raros else "—")

    cab, c1, c2, c3, fila1, fila2 = textos[6]
    datos = [
        [Paragraph(x, E_COMIDAS_CAB) for x in (cab, c1, c2, c3)],
        [Paragraph(fila1, E_COMIDAS_CEL)] + [Paragraph(x, E_COMIDAS_CEL) for x in generales],
        [Paragraph(fila2, E_COMIDAS_CEL)] + [Paragraph(x, E_COMIDAS_CEL) for x in especiales],
    ]
    ancho = sum(COLS)
    anchos = [ancho * 0.2, ancho * 0.2667, ancho * 0.2667, ancho * 0.2666]
    t = Table(datos, colWidths=anchos, repeatRows=1)
    t.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, col(LINEA)),
        ("BACKGROUND", (0, 0), (-1, 0), col(GRANATE)),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    return t


def celda_sesion(s, ET, niveles):
    """El contenido de una celda de sesión: rótulo, título, profesor y nivel."""
    fondo, _ = color_de(s)
    t_titulo, t_profe, t_nivel = tintas(fondo)
    k = clave(s)
    partes = []

    if k in ROTULO_COLOR:
        clave_rotulo, color_rotulo = ROTULO_COLOR[k]
        rotulo = ET.get(clave_rotulo, clave_rotulo).upper()
        partes.append(Paragraph(rotulo, estilo("rot", 6.5, legible(fondo, color_rotulo), True, leading=8)))

    partes.append(Paragraph(titulo(s), estilo("tit", 8.5 if k.startswith("comp") else 8,
                                              t_titulo, True, leading=10)))
    if s.get("p"):
        partes.append(Paragraph(s["p"], estilo("prof", 7, t_profe, cursiva=True, leading=8.6)))
    if s.get("l"):
        nivel = niveles.get(s.get("lClave") or s["l"], s["l"])
        partes.append(Paragraph("· " + nivel, estilo("niv", 6.5, t_nivel, True, leading=8)))
    return partes


def tabla_dia(d, ET, niveles, textos, lang):
    """La tabla de un día: cabecera negra, columna de hora y los cuatro salones."""
    filas = [[Paragraph(ET["leyenda_hora"], E_CAB_TABLA)] +
             [Paragraph(ET["salas"][k], E_CAB_TABLA) for k in SALAS]]
    estilos = [
        ("GRID", (0, 0), (-1, -1), 0.5, col(LINEA)),
        ("BACKGROUND", (0, 0), (-1, 0), col(FONDO_CABECERA)),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("VALIGN", (0, 0), (-1, 0), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]

    n = 0
    for sl in agrupa(d["sessions"]):
        n += 1
        banda = [s for s in sl["items"] if s["r"] == "full"]
        if banda:
            s = banda[0]
            fondo, _ = color_de(s)
            if s["k"] == "meal":
                # Las comidas ocupan la fila entera y llevan la hora dentro.
                txt = f'{s["n"].upper()}  ·  {hora_texto(sl["t"], lang)}'
                filas.append([Paragraph(txt, E_COMIDA), "", "", "", ""])
                estilos += [("SPAN", (0, n), (-1, n)),
                            ("BACKGROUND", (0, n), (-1, n), col(FONDO_COMIDA)),
                            ("VALIGN", (0, n), (-1, n), "MIDDLE")]
            elif s["k"] == "info":
                # Como en el documento: la hora aparte y el texto en el primer salón.
                t_titulo, _, _ = tintas(BLANCO)
                filas.append([Paragraph(hora_texto(sl["t"], lang), E_HORA),
                              Paragraph(s["n"], estilo("info", 8, t_titulo, leading=10)), "", "", ""])
                estilos += [("BACKGROUND", (0, n), (0, n), col(FONDO_HORA)),
                            ("VALIGN", (0, n), (0, n), "MIDDLE")]
            else:
                t_titulo, _, _ = tintas(fondo)
                filas.append([Paragraph(hora_texto(sl["t"], lang), E_HORA),
                              Paragraph(s["n"], estilo("banda", 8, t_titulo, True, leading=10)), "", "", ""])
                estilos += [("SPAN", (1, n), (-1, n)),
                            ("BACKGROUND", (1, n), (-1, n), col(fondo)),
                            ("BACKGROUND", (0, n), (0, n), col(FONDO_HORA)),
                            ("VALIGN", (0, n), (-1, n), "MIDDLE")]
            continue

        fila = [Paragraph(hora_texto(sl["t"], lang), E_HORA)]
        estilos += [("BACKGROUND", (0, n), (0, n), col(FONDO_HORA)),
                    ("VALIGN", (0, n), (0, n), "MIDDLE")]
        for i, k in enumerate(SALAS):
            s = next((x for x in sl["items"] if x["r"] == k), None)
            if s is None:
                fila.append("")
                continue
            fila.append(celda_sesion(s, ET, niveles))
            estilos.append(("BACKGROUND", (i + 1, n), (i + 1, n), col(color_de(s)[0])))
        filas.append(fila)

    t = Table(filas, colWidths=COLS, repeatRows=1)
    t.setStyle(TableStyle(estilos))
    return t


def agrupa(sessions):
    """Las sesiones por franja horaria, conservando el orden de los datos."""
    franjas = []
    for s in sessions:
        if franjas and franjas[-1]["t"] == s["t"] and not any(
                x["r"] == "full" for x in franjas[-1]["items"]) and s["r"] != "full":
            franjas[-1]["items"].append(s)
        else:
            franjas.append({"t": s["t"], "items": [s]})
    return franjas


def main(ruta_datos, lang, salida):
    datos = json.load(open(ruta_datos, encoding="utf8"))[lang]
    P = datos["dias"]
    ET = dict(datos["etiquetas"])
    ET["leyenda_hora"] = {"es": "HORA", "en": "TIME", "it": "ORA"}[lang]
    textos = PORTADA[lang]
    niveles = datos["niveles"]

    doc = BaseDocTemplate(
        salida, pagesize=landscape(A4),
        leftMargin=MARGEN_X, rightMargin=MARGEN_X,
        topMargin=MARGEN_Y, bottomMargin=MARGEN_Y + 10,
        title=TITULO_PDF[lang], author="La Negra Dance Festival",
    )
    marco = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="cuerpo",
                  leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)

    def pie(c, d):
        c.saveState()
        c.setFont("Helvetica", 6.5)
        c.setFillColorRGB(*GRIS)
        c.drawCentredString(d.pagesize[0] / 2, 14,
                            f"{textos[4]}  ·  {textos[5]} {d.page}")
        c.restoreState()

    doc.addPageTemplates([PageTemplate(id="normal", frames=[marco], onPage=pie)])

    story = [
        Paragraph(textos[0], E_TITULO),
        Paragraph(textos[1], E_SUBTITULO),
        Paragraph(textos[2], E_SEDE),
        Spacer(1, 12),
        tabla_comidas(P, textos, lang),
        Paragraph(leyenda(ET, datos, textos), E_LEYENDA),
    ]

    for d in P:
        cab = f'{d["day"]} {fecha_larga(d["date"], lang)}'.upper()
        story.append(Paragraph(cab, E_DIA))
        story.append(tabla_dia(d, ET, niveles, textos, lang))
        story.append(Paragraph(datos["note"], E_DESCARGO))

    story.append(Paragraph(textos[3], E_CIERRE))
    doc.build(story)

    kb = os.path.getsize(salida) // 1024
    print(f"PDF regenerado: {kb} KB · {salida}")


def leyenda(ET, datos, textos):
    """La línea de leyenda del documento, con los cuadraditos de color."""
    def cuadro(hex_color, etiqueta):
        h = SUSTITUCIONES.get(hex_color, hex_color)
        return f'<font color="#{h}">■</font> {etiqueta}'

    niveles = datos["niveles"]
    orden = ["Abierto", "Medio", "Medio-Alto", "Avanzado"]
    lista = " · ".join(niveles.get(k, k) for k in orden if k in niveles)
    partes = [
        f"<b>{textos[8]}</b>  ",
        cuadro("fce8eb", ET["salsa"]) + "     ",
        cuadro("f1e6f6", ET["bachata"]) + "     ",
        cuadro("fff2cc", ET["master"]) + "     ",
        cuadro("3a3a3a", ET["kind_social"]) + "     ",
        cuadro("ededed", ET["kind_meal"]) + "     ",
        f'<b>{textos[9]}</b> <font color="#b3122e"><b>{lista}</b></font>',
    ]
    return "".join(partes)


if __name__ == "__main__":
    ruta = sys.argv[1] if len(sys.argv) > 1 else "/tmp/programa.json"
    idiomas = sys.argv[2:] or list(PDF_POR_IDIOMA)
    for lang in idiomas:
        main(ruta, lang, PDF_POR_IDIOMA[lang])
