#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Compone las imágenes de compartir (og:image) de /concierto-danij/, una por
idioma, en public/img/og/.

    PYTHONPATH=<ruta-a-Pillow> python3 scripts/og-concierto-danij.py <foto.jpg>

La foto de prensa de Dani J es vertical y las tarjetas de WhatsApp, Facebook y
X son apaisadas de 1200x630: recortarla sin más le cortaría la cabeza. Por eso
va entera a la derecha, escalada por el alto, y el texto a la izquierda sobre
un degradado que arranca del propio gris de fondo de la foto, para que no se
note la costura.
"""
import os
import sys

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
ANCHO_FOTO = 620
ORO = (204, 153, 51)
HELVETICA = "/System/Library/Fonts/HelveticaNeue.ttc"

TEXTOS = {
    "es": {
        "archivo": "concierto-danij.jpg",
        "epigrafe": "DANI J · SÁBADO 24 DE OCTUBRE",
        "titulo": ["Tú eliges", "el repertorio"],
        "pie": "Vota tus 10 canciones favoritas",
    },
    "en": {
        "archivo": "concierto-danij-en.jpg",
        "epigrafe": "DANI J · SATURDAY 24 OCTOBER",
        "titulo": ["You choose", "the setlist"],
        "pie": "Vote for your 10 favourite songs",
    },
    "it": {
        "archivo": "concierto-danij-it.jpg",
        "epigrafe": "DANI J · SABATO 24 OTTOBRE",
        "titulo": ["Scegli tu", "la scaletta"],
        "pie": "Vota le tue 10 canzoni preferite",
    },
}


def componer(foto, t, destino):
    bold = lambda s: ImageFont.truetype(HELVETICA, s, index=1)
    regular = lambda s: ImageFont.truetype(HELVETICA, s, index=0)

    # Fondo: el gris de la propia foto, oscurecido
    muestra = foto.crop((20, 20, 180, 180)).resize((1, 1)).getpixel((0, 0))
    base = tuple(int(c * 0.34) for c in muestra)
    lienzo = Image.new("RGB", (W, H), base)

    escala = H / foto.height
    nf = foto.resize((max(1, round(foto.width * escala)), H), Image.LANCZOS)
    centro = int(nf.width * 0.52)          # su cara cae algo a la izquierda del centro
    izq = max(0, min(centro - ANCHO_FOTO // 2, nf.width - ANCHO_FOTO))
    lienzo.paste(nf.crop((izq, 0, izq + ANCHO_FOTO, H)), (W - ANCHO_FOTO, 0))

    # Degradado que funde el borde izquierdo de la foto con el fondo
    velo = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    vd = ImageDraw.Draw(velo)
    x0, x1 = W - ANCHO_FOTO, W - ANCHO_FOTO + 300
    for x in range(x0, x1):
        p = (x - x0) / (x1 - x0)
        vd.line([(x, 0), (x, H)], fill=base + (int(255 * (1 - p) ** 1.5),))
    vd.rectangle([0, 0, x0, H], fill=base + (255,))
    lienzo = Image.alpha_composite(lienzo.convert("RGBA"), velo).convert("RGB")

    d = ImageDraw.Draw(lienzo)

    # El logo es negro: sobre fondo oscuro se repinta en blanco
    try:
        logo = Image.open("public/img/logo-lanegra-face.png").convert("RGBA")
        blanco = Image.new("RGBA", logo.size, (255, 255, 255, 255))
        blanco.putalpha(logo.getchannel("A"))
        alto = 104
        blanco = blanco.resize((round(logo.width * alto / logo.height), alto), Image.LANCZOS)
        lienzo.paste(blanco, (58, 46), blanco)
    except Exception as e:  # sin logo antes que sin imagen
        print("  aviso · no se pudo poner el logo:", e)

    y = 300
    d.text((60, y), t["epigrafe"], font=bold(25), fill=ORO)
    y += 48
    for linea in t["titulo"]:
        d.text((60, y), linea, font=bold(66), fill=(255, 255, 255))
        y += 74
    d.text((62, y + 10), t["pie"], font=regular(28), fill=(228, 224, 234))

    lienzo.save(destino, "JPEG", quality=88, optimize=True, progressive=True)
    print(f"  {destino} · {W}x{H} · {os.path.getsize(destino) // 1024} KB")


def main(ruta_foto):
    foto = Image.open(ruta_foto).convert("RGB")
    os.makedirs("public/img/og", exist_ok=True)
    for lang, t in TEXTOS.items():
        componer(foto, t, "public/img/og/" + t["archivo"])


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "danij.jpg")
