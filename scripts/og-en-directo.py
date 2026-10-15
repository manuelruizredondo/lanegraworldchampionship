#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Compone las imágenes de compartir (og:image) de /en-directo/, una por idioma,
en public/img/og/.

    PYTHONPATH=<ruta-a-Pillow> python3 scripts/og-en-directo.py

Un enlace a un directo compite en el chat con todo lo demás, así que lo que
tiene que saltar a la vista es el testigo rojo de «EN DIRECTO», no la foto. De
ahí el orden: distintivo arriba, titular grande debajo y la foto del escenario
oscurecida al fondo, con un velo más denso a la izquierda para que el texto se
lea sin depender de la zona de la imagen que toque.
"""
import os

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
ORO = (204, 153, 51)
ROJO = (224, 32, 32)
BLANCO = (255, 255, 255)
CLARO = (228, 224, 234)
HELVETICA = "/System/Library/Fonts/HelveticaNeue.ttc"

# Plano general del Gran Salón: se ve el escenario y la pantalla del festival,
# que es exactamente lo que se va a emitir.
FONDO = "public/img/2025/03/lanegra-dance-festival-slide-2.webp"
LOGO = "public/img/logo-lanegra-face.png"

TEXTOS = {
    "es": {
        "archivo": "en-directo.jpg",
        "distintivo": "EN DIRECTO",
        "epigrafe": "XV MUNDIAL DE PASOS LIBRES",
        "titulo": ["Semifinales y", "grandes finales"],
        "pie": "Del 23 al 25 de octubre · Calpe, España",
    },
    "en": {
        "archivo": "en-directo-en.jpg",
        "distintivo": "LIVE",
        "epigrafe": "XV PASOS LIBRES WORLD CHAMPIONSHIP",
        "titulo": ["Semifinals and", "grand finals"],
        "pie": "23 to 25 October · Calpe, Spain",
    },
    "it": {
        "archivo": "en-directo-it.jpg",
        "distintivo": "IN DIRETTA",
        "epigrafe": "XV MONDIALE PASOS LIBRES",
        "titulo": ["Semifinali e", "grandi finali"],
        "pie": "Dal 23 al 25 ottobre · Calpe, Spagna",
    },
}


def fondo():
    """La foto es muy apaisada (1920x806). Se escala por el alto y se recorta
    por el centro, así entra el grupo entero y solo se pierden los laterales."""
    foto = Image.open(FONDO).convert("RGB")
    escala = H / foto.height
    nf = foto.resize((round(foto.width * escala), H), Image.LANCZOS)
    izq = (nf.width - W) // 2
    base = nf.crop((izq, 0, izq + W, H))

    # Oscurecido general + velo degradado desde la izquierda.
    base = Image.eval(base, lambda c: int(c * 0.40))
    velo = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    vd = ImageDraw.Draw(velo)
    for x in range(0, 820):
        p = x / 820.0
        vd.line([(x, 0), (x, H)], fill=(15, 11, 30, int(215 * (1 - p) ** 1.4)))
    return Image.alpha_composite(base.convert("RGBA"), velo).convert("RGB")


def pon_logo(lienzo):
    """El logo es negro: sobre fondo oscuro se repinta en blanco."""
    try:
        logo = Image.open(LOGO).convert("RGBA")
        blanco = Image.new("RGBA", logo.size, BLANCO + (255,))
        blanco.putalpha(logo.getchannel("A"))
        alto = 96
        blanco = blanco.resize((round(logo.width * alto / logo.height), alto), Image.LANCZOS)
        lienzo.paste(blanco, (58, 44), blanco)
    except Exception as e:  # sin logo antes que sin imagen
        print("  aviso · no se pudo poner el logo:", e)


def distintivo(d, x, y, texto, fuente):
    """La píldora roja con el punto de grabación."""
    alto, pad, r = 52, 26, 9
    ancho = pad * 2 + 20 + d.textlength(texto, font=fuente)
    d.rounded_rectangle([x, y, x + ancho, y + alto], radius=alto // 2, fill=ROJO)
    cy = y + alto // 2
    d.ellipse([x + pad - 2, cy - r, x + pad - 2 + r * 2, cy + r], fill=BLANCO)
    d.text((x + pad + r * 2 + 10, cy), texto, font=fuente, fill=BLANCO, anchor="lm")
    return alto


def componer(t, destino):
    bold = lambda s: ImageFont.truetype(HELVETICA, s, index=1)
    regular = lambda s: ImageFont.truetype(HELVETICA, s, index=0)

    lienzo = fondo()
    pon_logo(lienzo)
    d = ImageDraw.Draw(lienzo)

    y = 232
    y += distintivo(d, 60, y, t["distintivo"], bold(25)) + 30
    d.text((60, y), t["epigrafe"], font=bold(22), fill=ORO)
    y += 42
    for linea in t["titulo"]:
        d.text((60, y), linea, font=bold(60), fill=BLANCO)
        y += 70
    d.text((62, y + 8), t["pie"], font=regular(27), fill=CLARO)

    lienzo.save(destino, "JPEG", quality=88, optimize=True, progressive=True)
    print(f"  {destino} · {W}x{H} · {os.path.getsize(destino) // 1024} KB")


def main():
    os.makedirs("public/img/og", exist_ok=True)
    for t in TEXTOS.values():
        componer(t, "public/img/og/" + t["archivo"])


if __name__ == "__main__":
    main()
