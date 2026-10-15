#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Anima el rótulo del Mundial: el banner se forma de izquierda a derecha, la
chapa del logo entra con un pequeño rebote y las estrellas parpadean.

    PYTHONPATH=<numpy+scipy+Pillow> python3 scripts/rotulo-animado.py <rotulo.png> [salida/]

Saca tres archivos:

  rotulo-entrada.mov   ProRes 4444 con alfa · la formación (2 s)
  rotulo-bucle.mov     ProRes 4444 con alfa · solo el parpadeo, en bucle (4 s)
  rotulo-preview.mp4   H.264 sobre el escenario, para verlo de un vistazo

La entrada termina EXACTAMENTE en el primer fotograma del bucle, y el bucle
cierra donde empieza, así que realización puede encadenar entrada → bucle ×N
sin que se note la costura. Por eso los periodos de parpadeo dividen a la
duración del bucle: si no, la última estrella no volvería a su sitio.
"""
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

FPS = 25
F_ENTRADA = 50            # 2 s
F_BUCLE = 100             # 4 s
DUR_BUCLE = F_BUCLE / FPS

CORTE_CHAPA = 352         # a la izquierda, la chapa del logo; a la derecha, el banner
ORO = np.array([255, 214, 120], np.float32)
FONDO_PREVIEW = "public/img/2025/03/lanegra-dance-festival-slide-2.webp"


def suave(t):
    """smoothstep: arranca y para sin tirones."""
    t = np.clip(t, 0, 1)
    return t * t * (3 - 2 * t)


def rebote(p):
    """Se pasa un pelín de tamaño y vuelve: da sensación de peso al aterrizar."""
    p = float(np.clip(p, 0, 1))
    c1 = 1.70158
    return 1 + (c1 + 1) * (p - 1) ** 3 + c1 * (p - 1) ** 2


def estrellas(rgb, alfa):
    """Separa los puntos de luz de los filetes dorados.

    Un paso alto deja lo pequeño y brillante, pero también los filetes, que son
    igual de luminosos. La diferencia es la forma: las estrellas son manchas
    diminutas y casi cuadradas, y los filetes, líneas de cientos de píxeles. Se
    etiquetan las manchas y se descartan las que no quepan en 46 px.
    """
    lum = rgb @ np.array([.2126, .7152, .0722], np.float32)
    sue = np.asarray(Image.fromarray(lum.astype(np.uint8))
                     .filter(ImageFilter.GaussianBlur(9))).astype(np.float32)
    mask = ((lum - sue) > 30) & (alfa > 200)
    mask[:, :430] = False          # la chapa del logo no parpadea
    lab, n = ndimage.label(mask, structure=np.ones((3, 3)))
    if not n:
        return np.zeros_like(lum), np.zeros_like(lum), np.zeros_like(lum)

    tam = np.bincount(lab.ravel())[1:]
    cajas = ndimage.find_objects(lab)
    an = np.array([c[1].stop - c[1].start for c in cajas])
    al = np.array([c[0].stop - c[0].start for c in cajas])
    ok = ((tam >= 3) & (tam <= 400) & (an <= 46) & (al <= 46) &
          (np.maximum(an, al) <= 3.2 * np.minimum(an, al) + 4))

    rng = np.random.default_rng(7)
    # Cada estrella con su desfase y su ritmo. Los periodos son 4, 2 y 4/3 s:
    # los tres dividen a los 4 s del bucle, así que al final todas vuelven a
    # la misma fase con la que empezaron.
    fase_de = np.concatenate([[0], np.where(ok, rng.random(len(ok)), 0)])
    k_de = np.concatenate([[1], np.where(ok, rng.integers(1, 4, len(ok)), 1)])
    vivo = np.concatenate([[False], ok])

    dentro = vivo[lab]
    peso = np.where(dentro, np.clip((lum - sue) / 70.0, 0, 1), 0).astype(np.float32)
    fase = np.where(dentro, fase_de[lab], 0).astype(np.float32)
    k = np.where(dentro, k_de[lab], 1).astype(np.float32)
    print(f"  estrellas detectadas: {int(ok.sum())}")
    return peso, fase, k


def fotograma(rgb, alfa, peso, fase, k, halo, t, prog_banner, prog_chapa):
    """Un fotograma en RGBA float. `t` es el tiempo del parpadeo, en segundos."""
    a = alfa.copy()

    # ── Formación: el banner se descubre de izquierda a derecha ──────────
    if prog_banner < 1:
        borde = CORTE_CHAPA + suave(prog_banner) * (rgb.shape[1] - CORTE_CHAPA + 140)
        x = np.arange(rgb.shape[1], dtype=np.float32)
        velo = suave((borde - x) / 110.0)                  # 110 px de borde blando
        velo[:CORTE_CHAPA] = 1                             # la chapa va aparte
        a = a * velo

    sal = rgb.copy()

    # La chapa se compone aparte para poder escalarla sobre su propio centro.
    if prog_chapa < 1:
        a = a.copy()
        a[:, :CORTE_CHAPA] = 0
        sal[:, :CORTE_CHAPA] = 0

    # ── Parpadeo ─────────────────────────────────────────────────────────
    # Oscila alrededor del brillo original: unas suben mientras otras bajan,
    # que es lo que hace que se lea como un cielo y no como un intermitente.
    osc = np.sin(2 * np.pi * (t / DUR_BUCLE * k + fase)).astype(np.float32)
    sal += (peso * osc * 95)[..., None]
    sal += (halo * osc * 26)[..., None] * (ORO / 255.0)

    # ── Destello en el frente de la formación ────────────────────────────
    if prog_banner < 1:
        borde = CORTE_CHAPA + suave(prog_banner) * (rgb.shape[1] - CORTE_CHAPA + 140)
        x = np.arange(rgb.shape[1], dtype=np.float32)
        brillo = np.exp(-((x - borde) / 85.0) ** 2) * (1 - suave((prog_banner - .82) / .18))
        sal += (brillo[None, :] * 150)[..., None] * (ORO / 255.0)

    return np.clip(sal, 0, 255), np.clip(a, 0, 255)



def escribe(ruta, fotogramas, W, H, alfa=True):
    if alfa:
        cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
               "-f", "rawvideo", "-pix_fmt", "rgba", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
               "-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le", ruta]
    else:
        cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
               "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
               "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "19", "-movflags", "+faststart", ruta]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for f in fotogramas:
        p.stdin.write(f.tobytes())
    p.stdin.close()
    if p.wait():
        raise SystemExit("ffmpeg falló en " + ruta)
    print(f"  {ruta} · {os.path.getsize(ruta) // 1024} KB")


def fondo_preview(W, H):
    """Un plano del escenario, oscurecido: el rótulo se ve en su contexto."""
    try:
        foto = Image.open(FONDO_PREVIEW).convert("RGB")
    except Exception:
        return np.full((H, W, 3), (15, 11, 30), np.uint8)
    e = max(W / foto.width, H / foto.height)
    foto = foto.resize((round(foto.width * e), round(foto.height * e)), Image.LANCZOS)
    izq, arr = (foto.width - W) // 2, (foto.height - H) // 2
    foto = foto.crop((izq, arr, izq + W, arr + H))
    return (np.asarray(foto).astype(np.float32) * 0.45).astype(np.uint8)


def main(origen, destino):
    os.makedirs(destino, exist_ok=True)
    im = Image.open(origen).convert("RGBA")
    a = np.asarray(im).astype(np.float32)
    rgb, alfa = a[..., :3].copy(), a[..., 3].copy()
    H, W = alfa.shape
    print(f"  origen: {W}x{H}")

    peso, fase, k = estrellas(rgb, alfa)
    halo = np.asarray(Image.fromarray((peso * 255).astype(np.uint8))
                      .filter(ImageFilter.GaussianBlur(7))).astype(np.float32) / 255.0

    # La chapa del logo, recortada entera: se compone aparte para poder
    # escalarla sobre su propio centro sin arrastrar el banner.
    chapa_img = Image.fromarray(a[:, :CORTE_CHAPA].astype(np.uint8), "RGBA")
    CW, CH = chapa_img.size
    ccx, ccy = CW / 2, CH / 2

    def pon_chapa(fr, p):
        """p: 0 = sin aparecer · 1 = colocada."""
        if p >= 1:
            return fr
        esc = 0.62 + 0.38 * rebote(p)
        nw, nh = max(1, round(CW * esc)), max(1, round(CH * esc))
        pieza = np.asarray(chapa_img.resize((nw, nh), Image.LANCZOS)).astype(np.float32)
        pieza[..., 3] *= suave(p / 0.55)                     # entra fundiendo
        x0, y0 = round(ccx - nw / 2), round(ccy - nh / 2)
        # Recorte por si el rebote se sale del lienzo.
        sx0, sy0 = max(0, -x0), max(0, -y0)
        dx0, dy0 = max(0, x0), max(0, y0)
        an = min(nw - sx0, fr.shape[1] - dx0)
        al = min(nh - sy0, fr.shape[0] - dy0)
        if an <= 0 or al <= 0:
            return fr
        rec = pieza[sy0:sy0 + al, sx0:sx0 + an]
        dst = fr[dy0:dy0 + al, dx0:dx0 + an].astype(np.float32)
        ca = rec[..., 3:4] / 255.0
        da = dst[..., 3:4] / 255.0
        sa = ca + da * (1 - ca)                               # «source over»
        col = np.where(sa > 0, (rec[..., :3] * ca + dst[..., :3] * da * (1 - ca)) / np.maximum(sa, 1e-6), 0)
        fr[dy0:dy0 + al, dx0:dx0 + an] = np.clip(
            np.dstack([col, sa * 255]), 0, 255).astype(np.uint8)
        return fr

    def serie(n, t0, banner, chapa):
        for i in range(n):
            p = i / max(1, n - 1)
            c, al = fotograma(rgb, alfa, peso, fase, k, halo,
                              t0 + i / FPS, banner(p), chapa(p))
            yield pon_chapa(np.dstack([c, al]).astype(np.uint8), chapa(p))

    # La entrada ocupa el tiempo ANTERIOR al bucle, para encadenar sin salto.
    t0 = -F_ENTRADA / FPS
    entrada = list(serie(F_ENTRADA, t0,
                         lambda p: np.clip(p / .78, 0, 1),
                         lambda p: np.clip((p - .18) / .42, 0, 1)))
    bucle = list(serie(F_BUCLE, 0, lambda p: 1.0, lambda p: 1.0))

    print("\nCon canal alfa, para realización:")
    escribe(os.path.join(destino, "rotulo-entrada.mov"), entrada, W, H)
    escribe(os.path.join(destino, "rotulo-bucle.mov"), bucle, W, H)

    # ── Vista previa 1920x1080 ───────────────────────────────────────────
    PW, PH = 1920, 1080
    fondo = fondo_preview(PW, PH).astype(np.float32)
    escala = 1700 / W
    nw, nh = round(W * escala), round(H * escala)
    px, py = (PW - nw) // 2, PH - nh - 95

    def sobre_fondo(fr):
        cap = Image.fromarray(fr, "RGBA").resize((nw, nh), Image.LANCZOS)
        c = np.asarray(cap).astype(np.float32)
        out = fondo.copy()
        al = (c[..., 3:4] / 255.0)
        out[py:py + nh, px:px + nw] = c[..., :3] * al + out[py:py + nh, px:px + nw] * (1 - al)
        return out.astype(np.uint8)

    print("\nVista previa:")
    escribe(os.path.join(destino, "rotulo-preview.mp4"),
            (sobre_fondo(f) for f in (entrada + bucle + bucle)), PW, PH, alfa=False)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "rotulo.png",
         sys.argv[2] if len(sys.argv) > 2 else "docs/rotulos")
