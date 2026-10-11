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
import json
import os
import re
import sys

from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


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

# Rellenos oscuros del documento: ahí el texto va en blanco.
OSCUROS = {"0b5394", "3a3a3a", "1a1a1a", "b3122e"}


def color_de(s):
    """(fondo, tinta) de la sesión: el del documento si está, si no la regla.

    Se busca por el nombre ESPAÑOL (s["clave"]), que es el que indexa
    colores-drive.json, para que los tres idiomas salgan con el mismo color.
    """
    h = DRIVE.get(s.get("clave") or s.get("n") or "")
    if h:
        return rgb(h), (BLANCO if h in OSCUROS else NEGRO)
    return PALETA[clave(s)]


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


def main(ruta_datos, lang, salida):
    datos = json.load(open(ruta_datos, encoding="utf8"))[lang]
    P = datos["dias"]
    ET = datos["etiquetas"]
    c = canvas.Canvas(salida, pagesize=(W, H))
    c.setTitle(TITULO_PDF.get(lang, TITULO_PDF["es"]))
    c.setAuthor("La Negra Dance Festival")

    def rotulo(s):
        par = ROTULO_COLOR.get(clave(s))
        return (ET[par[0]], par[1]) if par else None

    def wrap(t, f, s, w):
        c.setFont(f, s)
        out = []
        for par in (t or "").split("\n"):
            ln = ""
            for pal in par.split():
                p = (ln + " " + pal).strip()
                if c.stringWidth(p, f, s) <= w:
                    ln = p
                else:
                    out.append(ln)
                    ln = pal
            out.append(ln)
        return [l for l in out if l]

    def alto(s):
        a = PAD + 10                                   # hora
        if rotulo(s):
            a += 9
        a += len(wrap(titulo(s), "Helvetica-Bold", 7.6, CW - 2 * PAD)) * 9.4
        if s.get("p"):
            a += len(wrap(s["p"], "Helvetica-Oblique", 6.8, CW - 2 * PAD)) * 8
        if s.get("l"):
            a += 9
        return max(a + PAD - 2, 40)

    def cabecera(dia, fecha):
        # Cabecera sobre el papel: sin banda negra, el logo y los dos textos en negro.
        try:
            c.drawImage(ImageReader("public/img/logo-lanegra-face.png"), M, H - 48,
                        height=40, preserveAspectRatio=True, anchor="sw", mask="auto")
        except Exception:
            pass
        c.setFillColorRGB(*NEGRO)
        c.setFont("Helvetica-Bold", 21)
        c.drawString(M + 74, H - 34, f"{dia} {fecha}")
        c.setFont("Helvetica-Bold", 8.5)
        c.drawRightString(W - M, H - 30, ET["cabecera"])

        # Cabecera de las cuatro columnas, en negro como en el documento
        y = H - 52 - 18
        x = M + TW
        for k in SALAS:
            c.setFillColorRGB(*CABECERA_TABLA)
            c.roundRect(x, y, CW, 14, 3, fill=1, stroke=0)
            c.setFillColorRGB(1, 1, 1)
            c.setFont("Helvetica-Bold", 6.8)
            c.drawCentredString(x + CW / 2, y + 4.6, ET["salas"][k])
            x += CW + 3

        # Leyenda de colores
        y -= 17
        x = M + TW
        NIV = datos["niveles"]
        for etiqueta, k in ((NIV["Abierto"], "taller-Abierto"), (NIV["Medio"], "taller-Medio"),
                            (NIV["Medio-Alto"], "taller-Medio-Alto"), (ET["master"], "master"),
                            (ET["bachata"], "comp-bachata"), (ET["salsa"], "comp-salsa"),
                            (ET["kind_social"], "social"), (ET["kind_meal"], "meal")):
            etiqueta = etiqueta.upper()
            fondo, tinta = PALETA[k]
            c.setFont("Helvetica-Bold", 5.6)
            an = c.stringWidth(etiqueta, "Helvetica-Bold", 5.6) + 11
            c.setFillColorRGB(*fondo)
            c.setStrokeColorRGB(*oscurece(fondo, .78))
            c.setLineWidth(.5)
            c.roundRect(x, y, an, 11, 5.5, fill=1, stroke=1)
            c.setFillColorRGB(*tinta)
            c.drawString(x + 5.5, y + 3.4, etiqueta)
            x += an + 5
        return y - 12

    def pie(n):
        c.setFillColorRGB(0.62, 0.60, 0.58)
        c.setFont("Helvetica", 6.5)
        c.drawString(M, 14, datos["note"])
        c.drawRightString(W - M, 14, f"campeonatopasoslibres.com · {ET['pag']} {n}")

    def tarjeta(s, x, y, h):
        fondo, tinta = color_de(s)
        c.setFillColorRGB(*fondo)
        c.setStrokeColorRGB(*oscurece(fondo, .78))
        c.setLineWidth(.8)
        c.roundRect(x, y - h, CW, h, 4, fill=1, stroke=1)

        k = clave(s)
        oscura = tinta == BLANCO
        t_titulo = BLANCO if oscura else TINTA_TITULO
        t_profe = TINTA_SOBRE_AZUL if k == "ciclo" else (rgb("cfcfcf") if oscura else TINTA_PROFE)
        t_nivel = BLANCO if oscura else TINTA_NIVEL

        ty = y - 13
        c.setFillColorRGB(*t_profe)
        c.setFont("Helvetica-Bold", 6.4)
        c.drawString(x + PAD, ty, s["t"])
        ty -= 9.5

        rot = rotulo(s)
        if rot:
            c.setFillColorRGB(*rot[1])
            c.setFont("Helvetica-Bold", 6.2)
            c.drawString(x + PAD, ty, rot[0])
            ty -= 9

        c.setFillColorRGB(*t_titulo)
        c.setFont("Helvetica-Bold", 7.6)
        for l in wrap(titulo(s), "Helvetica-Bold", 7.6, CW - 2 * PAD):
            c.drawString(x + PAD, ty, l)
            ty -= 9.4

        if s.get("p"):
            c.setFillColorRGB(*t_profe)
            c.setFont("Helvetica", 6.8)
            for l in wrap(s["p"], "Helvetica", 6.8, CW - 2 * PAD):
                c.drawString(x + PAD, ty, l)
                ty -= 8

        if s.get("l"):
            c.setFillColorRGB(*t_nivel)
            c.setFont("Helvetica-Bold", 6.4)
            c.drawString(x + PAD, ty - 1, "· " + s["l"])

    pag = 0
    for d in P:
        slots = []
        for s in d["sessions"]:
            if slots and slots[-1]["t"] == s["t"]:
                slots[-1]["items"].append(s)
            else:
                slots.append({"t": s["t"], "items": [s]})
        pag += 1
        y = cabecera(d["day"].upper(), d["date"])
        pie(pag)
        for sl in slots:
            banda = [s for s in sl["items"] if s["r"] == "full"]
            hh = 20 if banda else max([alto(s) for s in sl["items"]] or [40])
            if y - hh < 34:
                c.showPage()
                pag += 1
                y = cabecera(d["day"].upper() + f' ({ET["cont"]})', d["date"])
                pie(pag)
            if banda:
                s = banda[0]
                fondo, tinta = color_de(s)
                comida = s["k"] == "meal"
                c.setFillColorRGB(*fondo)
                c.roundRect(M, y - hh, W - 2 * M, hh, 3, fill=1, stroke=0)
                c.setFillColorRGB(*(ROJO_COMIDAS if comida else tinta))
                c.setFont("Helvetica-Bold", 7.6)
                c.drawCentredString(W / 2, y - hh + 7, f'{s["n"].upper()}  ·  {sl["t"]}')
                y -= hh + 5
                continue
            c.setFillColorRGB(*NEGRO)
            c.setFont("Helvetica-Bold", 7.6)
            c.drawString(M, y - 12, sl["t"])
            for s in sl["items"]:
                tarjeta(s, M + TW + SALAS.index(s["r"]) * (CW + 3), y, hh)
            y -= hh + 5
        c.showPage()
    c.save()
    print(f"PDF regenerado: {os.path.getsize(salida) // 1024} KB · {pag} páginas")


if __name__ == "__main__":
    ruta = sys.argv[1] if len(sys.argv) > 1 else "/tmp/programa.json"
    idiomas = sys.argv[2:] or list(PDF_POR_IDIOMA)
    for lang in idiomas:
        main(ruta, lang, PDF_POR_IDIOMA[lang])
