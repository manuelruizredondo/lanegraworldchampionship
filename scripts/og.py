#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera TODAS las imágenes de compartir (og:image) en public/img/og/.

    PYTHONPATH=<ruta-a-Pillow> python3 scripts/og.py

Todas van sobre negro, sin fotografía de fondo. Las versiones anteriores
llevaban un plano de gente bailando y el texto encima: en un chat, con la
tarjeta reducida, la foto compite con el titular y no se entiende ninguna de
las dos cosas. Sobre negro el titular se lee de un vistazo, que es lo único
que tiene que pasar en los dos segundos que alguien mira una vista previa.

Sustituye a los antiguos og-concierto-danij.py y og-en-directo.py.
"""
import os

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
NEGRO = (0, 0, 0)
ORO = (204, 153, 51)
BLANCO = (255, 255, 255)
GRIS = (176, 172, 184)
ROJO = (224, 32, 32)
HELVETICA = "/System/Library/Fonts/HelveticaNeue.ttc"
LOGO = "public/img/logo-lanegra-face.png"

# archivo → (cejilla, [líneas del titular], pie, distintivo rojo opcional)
IMAGENES = {
    "festival.jpg": (
        "21–25 OCTUBRE 2026 · CALPE",
        ["La Negra", "Dance Festival"],
        "Festival de salsa y bachata + Mundial de Pasos Libres", None),
    "mundial.jpg": (
        "LA NEGRA WORLD CHAMPIONSHIP",
        ["Mundial de", "Pasos Libres"],
        "Salsa y bachata · Calpe, 21–25 octubre 2026", None),
    "programacion.jpg": (
        "LA NEGRA DANCE FESTIVAL",
        ["Programación 2026"],
        "Talleres, masterclasses y las pruebas del Mundial", None),

    "concierto-danij.jpg": (
        "DOMINGO 25 DE OCTUBRE · CALPE",
        ["Dani J", "en concierto"],
        "Entrada por 35 € · No hace falta pase de festival", None),
    "concierto-danij-en.jpg": (
        "SUNDAY 25 OCTOBER · CALPE",
        ["Dani J", "live in concert"],
        "Tickets €35 · No festival pass needed", None),
    "concierto-danij-it.jpg": (
        "DOMENICA 25 OTTOBRE · CALPE",
        ["Dani J", "in concerto"],
        "Biglietto 35 € · Senza pass del festival", None),

    "en-directo.jpg": (
        "XV MUNDIAL DE PASOS LIBRES",
        ["Semifinales y", "grandes finales"],
        "Del 23 al 25 de octubre · Calpe, España", "EN DIRECTO"),
    "en-directo-en.jpg": (
        "XV PASOS LIBRES WORLD CHAMPIONSHIP",
        ["Semifinals and", "grand finals"],
        "23 to 25 October · Calpe, Spain", "LIVE"),
    "en-directo-it.jpg": (
        "XV MONDIALE PASOS LIBRES",
        ["Semifinali e", "grandi finali"],
        "Dal 23 al 25 ottobre · Calpe, Spagna", "IN DIRETTA"),
}


def pon_logo(lienzo):
    """El logo es negro: sobre fondo oscuro se repinta en blanco."""
    try:
        logo = Image.open(LOGO).convert("RGBA")
        blanco = Image.new("RGBA", logo.size, BLANCO + (255,))
        blanco.putalpha(logo.getchannel("A"))
        alto = 94
        blanco = blanco.resize((round(logo.width * alto / logo.height), alto), Image.LANCZOS)
        lienzo.paste(blanco, (60, 48), blanco)
    except Exception as e:  # sin logo antes que sin imagen
        print("  aviso · no se pudo poner el logo:", e)


def distintivo(d, x, y, texto, fuente):
    """Píldora roja con el punto de grabación, para los directos."""
    alto, pad, r = 50, 25, 8
    ancho = pad * 2 + 18 + d.textlength(texto, font=fuente)
    d.rounded_rectangle([x, y, x + ancho, y + alto], radius=alto // 2, fill=ROJO)
    cy = y + alto // 2
    d.ellipse([x + pad - 2, cy - r, x + pad - 2 + r * 2, cy + r], fill=BLANCO)
    d.text((x + pad + r * 2 + 9, cy), texto, font=fuente, fill=BLANCO, anchor="lm")
    return alto


def componer(nombre, cejilla, titulo, pie, marca):
    bold = lambda s: ImageFont.truetype(HELVETICA, s, index=1)
    regular = lambda s: ImageFont.truetype(HELVETICA, s, index=0)

    lienzo = Image.new("RGB", (W, H), NEGRO)
    pon_logo(lienzo)
    d = ImageDraw.Draw(lienzo)

    # Filete dorado fino bajo el logo: da estructura sin robar atención.
    d.line([(60, 182), (240, 182)], fill=ORO, width=3)

    # El bloque de texto se monta de abajo arriba para que el pie quede
    # siempre a la misma altura, tenga el titular una línea o dos.
    cuerpo = 70 if max(len(l) for l in titulo) <= 16 else 60
    alto_bloque = 34 + len(titulo) * (cuerpo + 10) + 58 + (74 if marca else 0)
    y = H - 72 - alto_bloque

    if marca:
        y += distintivo(d, 60, y, marca, bold(24)) + 24
    d.text((60, y), cejilla, font=bold(22), fill=ORO)
    y += 40
    for linea in titulo:
        d.text((60, y), linea, font=bold(cuerpo), fill=BLANCO)
        y += cuerpo + 10
    d.text((62, y + 20), pie, font=regular(26), fill=GRIS)

    destino = "public/img/og/" + nombre
    lienzo.save(destino, "JPEG", quality=90, optimize=True, progressive=True)
    print("  %-26s %3d KB" % (nombre, os.path.getsize(destino) // 1024))


def main():
    os.makedirs("public/img/og", exist_ok=True)
    for nombre, (cej, tit, pie, marca) in IMAGENES.items():
        componer(nombre, cej, tit, pie, marca)


if __name__ == "__main__":
    main()
