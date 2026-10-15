#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera docs/rotulos-escenario-mundial.pdf: la hoja de trabajo que se le pasa al
diseñador de los rótulos de pantalla del Mundial.

    PYTHONPATH=<ruta-a-reportlab> python3 scripts/rotulos-pdf.py

Todo en blanco y negro: la jerarquía se hace con cuerpo, peso y aire, nunca con
color. Los únicos valores de color que aparecen son los HEX de la paleta de
marca, y van como texto porque son el dato, no la decoración.

Las cifras de participantes y los nombres de prueba salen de los datos reales de
competidores2026.js. Si cambian las categorías, hay que revisarlos a mano: aquí
están copiados, no leídos, para que el PDF se pueda generar sin node.
"""
import os

from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import (
    BaseDocTemplate, Flowable, Frame, KeepTogether, PageBreak, PageTemplate,
    Paragraph, Spacer, Table, TableStyle,
)

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SALIDA = os.path.join(RAIZ, "docs", "rotulos-escenario-mundial.pdf")

# ── Grises ────────────────────────────────────────────────────────────────
# Seis valores y ni uno más. Por debajo de GRIS_SUAVE una línea ya no se ve
# impresa en láser, que es como va a acabar este documento encima de una mesa.
NEGRO = "#000000"
TINTA = "#1a1a1a"
GRIS = "#5a5a5a"
GRIS_CLARO = "#8c8c8c"
LINEA = "#b4b4b4"
GRIS_SUAVE = "#dcdcdc"
FONDO = "#f0f0f0"

ANCHO_PAG, ALTO_PAG = A4
MARGEN_X = 48
MARGEN_SUP = 54
MARGEN_INF = 46
ANCHO = ANCHO_PAG - 2 * MARGEN_X          # 499.27 pt

BASE = "Helvetica"
NEG = "Helvetica-Bold"
MONO = "Courier"
MONO_NEG = "Courier-Bold"

# ── Geometría de la plantilla de participante ─────────────────────────────
# En píxeles del lienzo de 1920 × 1080, que es como lo va a teclear el
# diseñador. Una sola fuente para el diagrama y para la tabla del mapa de
# coordenadas: si se tocan aquí, cuadran en los dos sitios.
#
# Las tres cajas no se pueden solapar y todas tienen que caber dentro del
# título seguro (y de 108 a 972). La banda va de 640 a 960, con 24 px de aire
# arriba y 30 abajo.
BANDA = (192, 640, 1536, 320)                 # x, y, ancho, alto
CAMPOS = {
    "categoria": (248, 664, 900, 50),
    "nombre": (248, 726, 1400, 140),
    "pais": (248, 876, 900, 54),
}
# Variante de equipos: sin país, el nombre se centra en el hueco que queda.
NOMBRE_SIN_PAIS = (248, 752, 1400, 140)
ROTULO = {"categoria": "3 · CATEGORÍA / RONDA", "nombre": "1 · NOMBRE", "pais": "2 · PAÍS"}


def _comprobar_geometria():
    """Las cajas se solapaban en la primera versión y el fallo llegó al PDF.
    Que no vuelva a pasar en silencio."""
    bx, by, ban, bal = BANDA
    assert by >= 108 and by + bal <= 972, "la banda se sale del título seguro"
    cajas = sorted(CAMPOS.values(), key=lambda c: c[1])
    for (_, y1, _, al1), (_, y2, _, _) in zip(cajas, cajas[1:]):
        assert y1 + al1 <= y2, "cajas de texto solapadas: %d > %d" % (y1 + al1, y2)
    for x, y, an, al in list(CAMPOS.values()) + [NOMBRE_SIN_PAIS]:
        assert x >= 192 and x + an <= 1728, "caja fuera del título seguro en horizontal"
        assert y >= by and y + al <= by + bal, "caja fuera de la banda"


_comprobar_geometria()


def estilo(nombre, **kw):
    kw.setdefault("fontName", BASE)
    kw.setdefault("textColor", TINTA)
    kw.setdefault("alignment", TA_LEFT)
    return ParagraphStyle(nombre, **kw)


E = {
    "h1": estilo("h1", fontName=NEG, fontSize=27, leading=29, textColor=NEGRO, spaceAfter=0),
    "h2": estilo("h2", fontName=NEG, fontSize=15, leading=18, textColor=NEGRO, spaceBefore=0, spaceAfter=7),
    "h3": estilo("h3", fontName=NEG, fontSize=10, leading=13, textColor=NEGRO, spaceBefore=12, spaceAfter=4),
    "cejilla": estilo("cejilla", fontName=NEG, fontSize=7, leading=9, textColor=GRIS_CLARO, spaceAfter=5),
    "cuerpo": estilo("cuerpo", fontSize=9, leading=13.5, spaceAfter=7),
    "entrada": estilo("entrada", fontSize=10.5, leading=15.5, textColor=GRIS, spaceAfter=9),
    "pie": estilo("pie", fontSize=8, leading=11.5, textColor=GRIS, spaceAfter=4),
    "celda": estilo("celda", fontSize=8.5, leading=11.5),
    "celda_neg": estilo("celda_neg", fontName=NEG, fontSize=8.5, leading=11.5),
    "celda_mono": estilo("celda_mono", fontName=MONO, fontSize=8, leading=11.5),
    "cab": estilo("cab", fontName=NEG, fontSize=7, leading=9, textColor=GRIS),
    "lista": estilo("lista", fontSize=9, leading=13.5, spaceAfter=4, leftIndent=12, bulletIndent=2),
}


def p(txt, est="cuerpo"):
    return Paragraph(txt, E[est])


def lista(items, est="lista"):
    return [Paragraph(t, E[est], bulletText="—") for t in items]


def cejilla(txt):
    """Versalita espaciada. reportlab no sabe de letter-spacing, así que el
    tracking se mete a mano; para siete puntos de cuerpo es lo que hay."""
    return p("&nbsp;".join(txt.upper()), "cejilla")


# ── Reglas y cajas ────────────────────────────────────────────────────────
class Regla(Flowable):
    def __init__(self, grosor=0.6, color=LINEA, ancho=ANCHO, aire=0):
        Flowable.__init__(self)
        self.grosor, self.color, self.ancho, self.aire = grosor, color, ancho, aire

    def wrap(self, aw, ah):
        return (self.ancho, self.grosor + self.aire)

    def draw(self):
        self.canv.setStrokeColor(self.color)
        self.canv.setLineWidth(self.grosor)
        self.canv.line(0, self.aire, self.ancho, self.aire)


def seccion(cejilla_txt, titulo, entrada=None):
    """Cabecera de sección: filete grueso, cejilla, titular."""
    fs = [Spacer(1, 26), Regla(1.4, NEGRO), Spacer(1, 9), cejilla(cejilla_txt), p(titulo, "h2")]
    if entrada:
        fs.append(p(entrada, "entrada"))
    return fs


def aviso(titulo, cuerpos, puntos=None):
    """Lo que el diseñador se va a saltar si no se le dice. Filete vertical
    grueso a la izquierda: en blanco y negro es lo único que destaca sin gritar."""
    dentro = [p(titulo, "h3")]
    for c in cuerpos:
        dentro.append(p(c))
    if puntos:
        dentro += lista(puntos)
    dentro[0].style = ParagraphStyle("avh", parent=E["h3"], spaceBefore=0)
    t = Table([[dentro]], colWidths=[ANCHO])
    t.setStyle(TableStyle([
        ("LINEBEFORE", (0, 0), (0, -1), 2.2, NEGRO),
        ("BACKGROUND", (0, 0), (-1, -1), FONDO),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 11),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 11),
    ]))
    return [Spacer(1, 6), t, Spacer(1, 6)]


def tabla(cabeceras, filas, anchos, monos=()):
    """Tabla de especificación. Sin rejilla: una línea gruesa bajo la cabecera
    y hairlines entre filas. Las columnas de `monos` van en Courier."""
    datos = [[Paragraph(c, E["cab"]) for c in cabeceras]]
    for fila in filas:
        celdas = []
        for i, v in enumerate(fila):
            est = "celda_mono" if i in monos else "celda"
            celdas.append(Paragraph(v, E[est]))
        datos.append(celdas)
    t = Table(datos, colWidths=anchos, repeatRows=1)
    t.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, 0), 1.0, NEGRO),
        ("LINEBELOW", (0, 1), (-1, -2), 0.4, GRIS_SUAVE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 5),
        ("BOTTOMPADDING", (0, 1), (-1, -1), 6),
    ]))
    return t


class Checklist(Flowable):
    """Casillas vacías de verdad, para marcarlas a boli."""
    LADO = 7.5
    SALTO = 16.5

    def __init__(self, items, ancho=ANCHO):
        Flowable.__init__(self)
        self.ancho = ancho
        self.items = items
        self._lineas = None

    def _partir(self):
        if self._lineas is not None:
            return self._lineas
        disponible = self.ancho - 20
        self._lineas = []
        for it in self.items:
            palabras, actual = it.split(" "), ""
            trozos = []
            for w in palabras:
                prueba = (actual + " " + w).strip()
                if stringWidth(prueba, BASE, 9) <= disponible:
                    actual = prueba
                else:
                    trozos.append(actual)
                    actual = w
            trozos.append(actual)
            self._lineas.append(trozos)
        return self._lineas

    def wrap(self, aw, ah):
        alto = 0
        for trozos in self._partir():
            alto += self.SALTO + (len(trozos) - 1) * 12
        return (self.ancho, alto + 6)

    def draw(self):
        c = self.canv
        y = self.wrap(0, 0)[1] - 6
        for trozos in self._partir():
            c.setStrokeColor(NEGRO)
            c.setLineWidth(0.8)
            c.rect(0, y - self.LADO + 1.5, self.LADO, self.LADO, stroke=1, fill=0)
            c.setFillColor(TINTA)
            c.setFont(BASE, 9)
            for i, t in enumerate(trozos):
                c.drawString(20, y - 6.5 - i * 12, t)
            y -= self.SALTO + (len(trozos) - 1) * 12


# ── Diagramas ─────────────────────────────────────────────────────────────
class Lienzo(Flowable):
    """Un 1920x1080 a escala. `pintar` recibe el canvas y dos funciones de
    conversión, así los números del dibujo son los mismos que el diseñador va a
    teclear en Photoshop."""

    def __init__(self, pintar, ancho=ANCHO):
        Flowable.__init__(self)
        self.pintar = pintar
        self.ancho = ancho
        self.alto = ancho * 1080.0 / 1920.0

    def wrap(self, aw, ah):
        return (self.ancho, self.alto)

    def draw(self):
        c = self.canv
        s = self.ancho / 1920.0
        px = lambda x: x * s
        py = lambda y: self.alto - y * s
        c.saveState()
        self.pintar(c, px, py, s)
        c.restoreState()


def _etiqueta(c, x, y, txt, cuerpo=6.2, fuente=MONO, color=TINTA, ancla="inicio"):
    c.setFillColor(color)
    c.setFont(fuente, cuerpo)
    {"inicio": c.drawString, "fin": c.drawRightString, "centro": c.drawCentredString}[ancla](x, y, txt)


def diagrama_seguras(c, px, py, s):
    # Lienzo
    c.setFillColor("#ffffff")
    c.setStrokeColor(NEGRO)
    c.setLineWidth(1.1)
    c.rect(0, 0, px(1920), px(1080), stroke=1, fill=1)

    # Banda del rótulo
    c.setFillColor(FONDO)
    c.rect(px(192), py(980), px(1536), px(240), stroke=0, fill=1)

    # Acción segura (5%)
    c.setStrokeColor(GRIS_CLARO)
    c.setLineWidth(0.7)
    c.setDash(3, 2)
    c.rect(px(96), py(1026), px(1728), px(972), stroke=1, fill=0)

    # Banda, borde
    c.setStrokeColor(GRIS)
    c.rect(px(192), py(980), px(1536), px(240), stroke=1, fill=0)
    c.setDash()

    # Título seguro (10%)
    c.setStrokeColor(NEGRO)
    c.setLineWidth(1.0)
    c.rect(px(192), py(972), px(1536), px(864), stroke=1, fill=0)

    _etiqueta(c, px(214), py(162), "TÍTULO SEGURO · 1536 × 864", 6.4, MONO_NEG, NEGRO)
    _etiqueta(c, px(214), py(798), "BANDA DEL RÓTULO · y 740 → 980", 6.4, MONO_NEG, NEGRO)
    _etiqueta(c, px(1714), py(162), "ACCIÓN SEGURA · 1728 × 972", 6.0, MONO, GRIS, "fin")
    _etiqueta(c, px(1714), py(950), "1920 × 1080", 6.0, MONO, GRIS_CLARO, "fin")

    # Sin cotas: el margen (192 / 108) va en la tabla de debajo. Dibujarlo
    # aquí cruzaba las líneas de las tres zonas y se leía peor.
    _etiqueta(c, px(214), py(1046), "margen 192 / 108", 6.0, MONO, GRIS_CLARO)


def diagrama_plantilla(c, px, py, s):
    c.setFillColor("#ffffff")
    c.setStrokeColor(NEGRO)
    c.setLineWidth(1.1)
    c.rect(0, 0, px(1920), px(1080), stroke=1, fill=1)

    # Decorado de ejemplo: banda + filete
    c.setFillColor(FONDO)
    c.rect(px(192), py(BANDA[1] + BANDA[3]), px(BANDA[2]), px(BANDA[3]), stroke=0, fill=1)
    c.setFillColor(NEGRO)
    c.rect(px(192), py(BANDA[1] + BANDA[3]), px(10), px(BANDA[3]), stroke=0, fill=1)

    # Campos, con las mismas cifras que la tabla del mapa de coordenadas
    for clave, (x, y, an, al) in CAMPOS.items():
        principal = clave == "nombre"
        col = NEGRO if principal else GRIS
        c.setStrokeColor(col)
        c.setLineWidth(1.3 if principal else 0.7)
        if not principal:
            c.setDash(3, 2)
        c.rect(px(x), py(y + al), px(an), px(al), stroke=1, fill=0)
        c.setDash()
        _etiqueta(c, px(x + 18), py(y + al / 2.0 + 14), ROTULO[clave],
                  8.0 if principal else 6.4, MONO_NEG if principal else MONO, col)

    nx, ny, nan, nal = CAMPOS["nombre"]
    _etiqueta(c, px(nx + nan - 18), py(ny + nal / 2.0 + 12),
              "%d × %d" % (nan, nal), 6.0, MONO, GRIS, "fin")

    # El título seguro va encima de la banda: así se ve que la banda cae dentro.
    c.setStrokeColor(GRIS_CLARO)
    c.setLineWidth(0.6)
    c.setDash(2, 2)
    c.rect(px(192), py(972), px(1536), px(864), stroke=1, fill=0)
    c.setDash()
    _etiqueta(c, px(206), py(146), "TÍTULO SEGURO", 6.0, MONO, GRIS_CLARO)

    # Cota vertical de la banda
    c.setStrokeColor(GRIS)
    c.setLineWidth(0.7)
    c.line(px(1790), py(BANDA[1]), px(1790), py(BANDA[1] + BANDA[3]))
    _etiqueta(c, px(1804), py(BANDA[1] + BANDA[3] / 2.0), str(BANDA[3]), 6.0, MONO, GRIS)


def figura(pintar, pie):
    return KeepTogether([Lienzo(pintar), Spacer(1, 6), p(pie, "pie"), Spacer(1, 4)])


# ── Página ────────────────────────────────────────────────────────────────
def decorar(c, doc):
    c.saveState()
    c.setFont(BASE, 7)
    c.setFillColor(GRIS_CLARO)
    if doc.page > 1:
        c.drawString(MARGEN_X, ALTO_PAG - 34,
                     "Rótulos de escenario · XV Mundial de Pasos Libres")
    c.drawRightString(ANCHO_PAG - MARGEN_X, 30, str(doc.page))
    c.drawString(MARGEN_X, 30, "Calpe · 21–25 octubre 2026")
    c.setStrokeColor(GRIS_SUAVE)
    c.setLineWidth(0.5)
    c.line(MARGEN_X, 42, ANCHO_PAG - MARGEN_X, 42)
    c.restoreState()


def construir():
    os.makedirs(os.path.dirname(SALIDA), exist_ok=True)
    doc = BaseDocTemplate(
        SALIDA, pagesize=A4,
        leftMargin=MARGEN_X, rightMargin=MARGEN_X,
        topMargin=MARGEN_SUP, bottomMargin=MARGEN_INF,
        title="Rótulos de escenario · XV Mundial de Pasos Libres",
        author="La Negra Dance Festival", subject="Hoja de trabajo para diseño",
    )
    marco = Frame(MARGEN_X, MARGEN_INF, ANCHO,
                  ALTO_PAG - MARGEN_SUP - MARGEN_INF, id="cuerpo",
                  leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates([PageTemplate(id="normal", frames=[marco], onPage=decorar)])

    f = []

    # ── Portada ───────────────────────────────────────────────────────────
    f += [
        Spacer(1, 10),
        cejilla("Hoja de trabajo · Diseño"),
        p("Rótulos de escenario", "h1"),
        Spacer(1, 14),
        p("Todo lo que hay que diseñar para la pantalla del XV Mundial de Pasos Libres. "
          "Son tres piezas distintas y se entregan de tres formas distintas. La segunda es "
          "la que más se usa y la que más fácil es entregar mal, así que lleva su propio "
          "apartado.", "entrada"),
        Spacer(1, 6),
        Regla(1.4, NEGRO),
        Spacer(1, 10),
    ]
    ficha = Table(
        [[Paragraph(k, E["celda_neg"]), Paragraph(v, E["celda"])] for k, v in (
            ("Evento", "La Negra Dance Festival · XV Mundial de Pasos Libres"),
            ("Sede", "Hotel AR Diamante Beach, Calpe"),
            ("Fechas", "21–25 de octubre de 2026"),
            ("Lienzo", "1920 × 1080 px · 16:9"),
            ("Piezas", "3 tipos · 11 portadas · 1 plantilla con 2 variantes"))],
        colWidths=[70, ANCHO - 70])
    ficha.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, -2), 0.4, GRIS_SUAVE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    f.append(ficha)

    # ── Las tres piezas ───────────────────────────────────────────────────
    f += seccion("Las tres piezas", "Qué hay que entregar")
    f.append(tabla(
        ["", "Pieza", "Qué es", "Formato"],
        [["A", "Rótulos fijos",
          "El texto no cambia nunca: nombre del MC, QR, jurado, avisos. Cada uno es una pieza "
          "cerrada y acabada.", "MOV con alfa + PNG"],
         ["B", "Plantilla de participante",
          "Una sola pieza vacía que se rellena 411 veces desde una hoja de cálculo. Se entrega "
          "<b>sin texto</b>.", "PNG con alfa + mapa de coordenadas"],
         ["C", "Portadas de competición",
          "Una por competición, a pantalla completa, para abrir cada bloque. Son 11.",
          "MOV o PNG a pantalla completa"]],
        [18, 104, ANCHO - 18 - 104 - 108, 108],
        monos=(0,),
    ))

    # ── Base común ────────────────────────────────────────────────────────
    f.append(PageBreak())
    f += seccion("Base común", "El lienzo y las zonas seguras",
                 "Esto vale para las tres piezas. Todo se diseña sobre 1920 × 1080 a tamaño "
                 "real, nunca escalado desde otro formato.")
    f.append(figura(diagrama_seguras,
                    "Nada legible sale del rectángulo de título seguro. Los adornos pueden "
                    "llegar al borde del lienzo; el texto, no."))
    f.append(Spacer(1, 6))
    f.append(tabla(
        ["Parámetro", "Valor", "Por qué"],
        [["Resolución", "1920 × 1080 px", "Lo pide realización. A tamaño real, sin ampliar desde otro lienzo."],
         ["Proporción", "16:9", "Pantalla del escenario y emisión."],
         ["Fotogramas", "25 fps", "Estándar de emisión en España. Confirmar con realización antes de animar."],
         ["Espacio de color", "sRGB", "No usar CMYK ni perfiles de imprenta."],
         ["Título seguro", "1536 × 864 · margen 192 / 108", "Todo el texto va dentro."],
         ["Acción segura", "1728 × 972 · margen 96 / 54", "Límite para elementos gráficos importantes."],
         ["Cuerpo mínimo", "36 px", "Por debajo no se lee en el directo desde el móvil."]],
        [92, 136, ANCHO - 92 - 136],
        monos=(1,),
    ))

    # ── Pieza A ───────────────────────────────────────────────────────────
    f.append(PageBreak())
    f += seccion("Pieza A", "Rótulos fijos",
                 "Contenido que no varía. Se diseñan enteros, con su texto puesto, y se "
                 "entregan acabados. Aquí sí puede haber animación.")
    f.append(tabla(
        ["Rótulo", "Contiene", "Formato"],
        [["Presentador / MC", "Nombre y, si procede, una línea de rol", "Rótulo inferior"],
         ["QR", "Código QR + una llamada corta a la acción", "Rótulo lateral o inferior"],
         ["Jurado", "Nombre y país del miembro del jurado", "Rótulo inferior"],
         ["Aviso / patrocinio", "Logotipo y texto corto", "Banda inferior"]],
        [110, ANCHO - 110 - 128, 128],
    ))
    f += aviso("El QR tiene reglas propias", [], [
        "Lado mínimo de <b>320 px</b> sobre el lienzo de 1920 × 1080. Más pequeño no lo lee "
        "una cámara de móvil desde la butaca.",
        "Zona de silencio alrededor: un margen limpio de al menos <b>el 8 % del lado</b> del "
        "propio código. No pegar nada a sus bordes.",
        "<b>Módulos oscuros sobre fondo claro</b>, nunca al revés: muchos lectores fallan con "
        "el QR invertido.",
        "Sobre un rectángulo <b>opaco</b>, no sobre el vídeo en directo: el contraste cambia "
        "cuando se mueve la imagen de detrás.",
        "Nada de degradados ni de logotipo encima, salvo que esté generado con corrección de "
        "errores alta y probado.",
        "Si se anima, que esté <b>quieto al menos 6 segundos</b> en pantalla. La gente "
        "necesita sacar el móvil.",
    ])
    f.append(p("Entrega de la pieza A", "h3"))
    f += lista([
        "<b>Animado:</b> .mov con canal alfa — ProRes 4444 o QuickTime Animation a Millions "
        "of Colors+. No sirve H.264: no guarda transparencia.",
        "<b>Fijo:</b> además, un .png de 1920 × 1080 con fondo transparente de cada rótulo, "
        "como respaldo si falla el vídeo.",
        "Entrada y salida de la animación de <b>12 a 20 fotogramas</b>, no más. El rótulo "
        "acompaña, no protagoniza.",
    ])

    # ── Pieza B ───────────────────────────────────────────────────────────
    f.append(PageBreak())
    f += seccion("Pieza B · la importante", "Plantilla de participante",
                 "Esta pieza se rellena 411 veces con datos de una hoja de cálculo. El "
                 "diseñador entrega el decorado vacío; los textos los coloca y los anima "
                 "realización.")
    f += aviso("Se entrega sin texto. Esto es lo que más se falla", [
        "No se entrega un PNG bonito con un nombre de ejemplo quemado dentro. Se entregan dos "
        "cosas separadas: el <b>decorado</b> en PNG con fondo transparente y los huecos de "
        "texto vacíos, y el <b>mapa de coordenadas</b> que dice exactamente dónde, con qué "
        "fuente, a qué cuerpo, de qué color y con qué alineación va cada campo.",
        "Hace falta también el <b>archivo editable</b> (.psd, .ai o Figma) con las capas "
        "separadas y sin aplanar, y las <b>fuentes</b> usadas.",
    ])
    f.append(Spacer(1, 4))
    f.append(figura(diagrama_plantilla,
                    "Las cajas discontinuas no se dibujan: marcan dónde caerá el texto que "
                    "pone realización. El decorado (la banda, el filete de la izquierda, lo "
                    "que proponga el diseñador) sí se entrega."))

    f.append(p("Mapa de coordenadas", "h3"))

    def caja(c):
        return "%d, %d · %d × %d" % (c[0], c[1], c[2], c[3])

    f.append(tabla(
        ["Campo", "Caja (x, y, an × al)", "Cuerpo", "Alineación", "Obligatorio"],
        [["<b>1 · Nombre</b>", caja(CAMPOS["nombre"]), "88 → 120 px",
          "Izquierda, centrado vertical en su caja", "Sí"],
         ["<b>2 · País</b>", caja(CAMPOS["pais"]), "44 px", "Izquierda",
          "No — los equipos no lo tienen"],
         ["<b>3 · Categoría / ronda</b>", caja(CAMPOS["categoria"]), "38 px · versales",
          "Izquierda", "No"],
         ["<b>1 · Nombre</b>, variante sin país", caja(NOMBRE_SIN_PAIS), "88 → 120 px",
          "Izquierda, centrado en el hueco", "Solo en la variante de equipos"]],
        [96, 112, 62, 118, ANCHO - 96 - 112 - 62 - 118],
        monos=(1, 2),
    ))
    f.append(Spacer(1, 8))
    f.append(p("La banda de fondo ocupa <b>%d, %d · %d × %d</b>. Ninguna de las cajas se "
               "solapa con otra y todas caben dentro del título seguro." % BANDA))
    f.append(Spacer(1, 8))
    f.append(p("El nombre es de cuerpo variable: <b>120 px</b> cuando cabe y baja hasta "
               "<b>88 px</b> en los nombres largos, sin pasar nunca de los 1400 px de ancho. "
               "El diseñador fija los dos extremos probándolos con los nombres reales de la "
               "tabla siguiente."))

    f.append(p("Los datos reales con los que hay que probarlo", "h3"))
    f.append(p("Son los de la edición 2026: 411 fichas repartidas en 16 rondas. El diseño "
               "tiene que aguantar estos casos, que son los que revientan una plantilla hecha "
               "solo con «Juan Pérez · España»."))
    f.append(tabla(
        ["Caso", "Ejemplo real", "Car.", "Qué comprueba"],
        [["Nombre más largo", "Martin Salgado Dance Company", "28", "Que no se salga ni se corte a 88 px"],
         ["Dúo, dos nombres", "Noelia Otero y Sara Luna", "24", "Que la caja aguante dos personas en una línea"],
         ["Nombre con tildes", "Breyner Guevara Ramírez", "24", "Que la tilde no choque con lo de arriba"],
         ["Nombre medio", "Ana León", "8", "Que a 120 px no quede ridículo el bloque"],
         ["País más largo", "España / República Dominicana", "31", "Doble nacionalidad: cabe en 900 px a 44 px"],
         ["<b>País vacío</b>", "(los 37 equipos no tienen país)", "0", "<b>Que el rótulo no quede cojo</b>"]],
        [92, 152, 26, ANCHO - 92 - 152 - 26],
        monos=(2,),
    ))
    f += aviso("Hacen falta dos variantes, no una", [
        "De las 411 fichas, <b>37 son equipos y no llevan país</b>. Si el país es una línea "
        "fija debajo del nombre, en esas 37 queda un hueco vacío y el rótulo se ve roto en "
        "pantalla.",
    ], [
        "<b>B1 · con país</b> — solistas, dúos y parejas. Los tres campos.",
        "<b>B2 · sin país</b> — equipos. El nombre centrado en la banda, ocupando el alto que "
        "dejaba el país.",
    ])
    f.append(p("Mismo decorado, misma banda, mismo sitio. Solo cambia la colocación del nombre."))

    f.append(p("Entrega de la pieza B", "h3"))
    f += lista([
        "rotulo-participante-con-pais.png — 1920 × 1080, PNG-24 con canal alfa, sin ningún texto.",
        "rotulo-participante-sin-pais.png — ídem, variante de equipos.",
        "El <b>archivo editable</b> con capas separadas y las cajas de texto vivas, para poder "
        "retocar cuerpos.",
        "Las <b>fuentes</b> usadas, en archivo. Tienen que incluir <b>tildes, ñ y ü</b>: en la "
        "lista hay Rumanía, Taiwán, España y Perú.",
        "Este mapa de coordenadas confirmado o corregido con los valores que haya usado de verdad.",
    ])

    # ── Pieza C ───────────────────────────────────────────────────────────
    f.append(PageBreak())
    f += seccion("Pieza C", "Portadas de competición",
                 "A pantalla completa, para abrir cada bloque. Son <b>11 competiciones</b>, "
                 "que en la edición 2026 se repartieron en 16 rondas sobre el escenario.")
    f.append(tabla(
        ["#", "Competición", "Rondas en 2026", "Particip."],
        [["1", "Bachata · Solista Femenino", "Preeliminatoria, Semifinal", "57"],
         ["2", "Bachata · Solista Masculino", "Final y Semifinal", "26"],
         ["3", "Bachata · Dúos", "Ronda única", "19"],
         ["4", "Bachata · Parejas", "Final", "17"],
         ["5", "Bachata · Equipos", "Ronda única", "18"],
         ["6", "Salsa · Solista Femenino", "Preeliminatoria, Eliminatoria, Final y Semifinal", "100"],
         ["7", "Salsa · Solista Masculino", "Preeliminatoria, Eliminatoria, Final y Semifinal", "87"],
         ["8", "Salsa · Dúos Femeninos", "Final y Semifinal", "25"],
         ["9", "Salsa · Dúos Masculinos", "Ronda única", "17"],
         ["10", "Salsa · Parejas", "Final y Semifinal", "26"],
         ["11", "Salsa · Equipos", "Ronda única", "19"]],
        [20, 150, ANCHO - 20 - 150 - 50, 50],
        monos=(0, 3),
    ))
    f.append(p("Cómo resolverlas sin diseñar 16 veces lo mismo", "h3"))
    f.append(p("Una portada por competición (11 archivos) con la <b>ronda como campo "
               "aparte</b>, igual que en la pieza B. Así la misma portada de «Salsa · Solista "
               "Femenino» sirve para la preeliminatoria, la eliminatoria y la final cambiando "
               "solo una línea. Los cuatro valores posibles son: <b>Preeliminatoria</b>, "
               "<b>Eliminatoria</b>, <b>Semifinal</b> y <b>Final</b>."))
    f.append(p("Qué lleva cada portada", "h3"))
    f += lista([
        "<b>Disciplina</b> — Salsa o Bachata. Es lo que más se tiene que ver desde el fondo de la sala.",
        "<b>Modalidad</b> — Solista Femenino, Dúos, Equipos…",
        "<b>Ronda</b> — campo variable, con su caja acotada como en la pieza B.",
        "<b>Identidad</b> — logotipo del Mundial y el año.",
        "Salsa y Bachata deben <b>distinguirse de un vistazo</b> por tratamiento, sin depender "
        "de leer el texto.",
    ])
    f.append(p("Entrega de la pieza C", "h3"))
    f += lista([
        "11 archivos a pantalla completa, 1920 × 1080. Fondo <b>opaco</b>: cubren toda la "
        "pantalla, no se superponen a nada.",
        "Si van animadas, .mov; si no, .png. Aquí no hace falta canal alfa.",
        "El archivo editable, con la caja de la ronda viva y vacía.",
    ])

    # ── Marca ─────────────────────────────────────────────────────────────
    f.append(PageBreak())
    f += seccion("Marca", "Con qué se diseña",
                 "Paleta y tipografías que ya usa la web del festival. El diseñador parte de "
                 "aquí, no inventa una nueva. Esta hoja va en blanco y negro a propósito; los "
                 "colores son el dato, no la muestra.")
    f.append(tabla(
        ["Color", "HEX", "Dónde se usa"],
        [["Oro", "#cc9933", "Acentos, filetes, cifras destacadas"],
         ["Oro oscuro", "#a28243", "Oro sobre fondo claro, cuando el oro no contrasta"],
         ["Oro claro", "#dbc8a8", "Fondos y superficies suaves"],
         ["Navy", "#0f0b1e", "Fondo principal oscuro"],
         ["Azul", "#3d436d", "Fondo secundario"],
         ["Crema", "#f6f2ec", "Fondo principal claro"]],
        [86, 76, ANCHO - 86 - 76],
        monos=(1,),
    ))
    f.append(Spacer(1, 12))
    f.append(tabla(
        ["Tipografía", "Uso en la web", "Uso en pantalla"],
        [["Archivo Expanded Black", "Titulares grandes", "Nombres de participante y disciplina en portadas"],
         ["Agrandir", "Titulares de marca", "Alternativa para portadas"],
         ["Amarillo", "Acento decorativo", "Solo adorno, nunca datos"],
         ["Anja Eliane", "Manuscrita de marca", "Solo adorno, nunca datos"],
         ["Inter", "Texto corrido", "País, ronda, textos secundarios"]],
        [130, 120, ANCHO - 130 - 120],
    ))
    f += aviso("Nada de fuentes decorativas en los datos", [
        "Amarillo y Anja Eliane son manuscritas: no se leen a distancia y no tienen por qué "
        "llevar todos los acentos. El nombre y el país van siempre en una tipografía de palo, "
        "legible y con el juego de caracteres completo.",
    ])

    # ── Cierre ────────────────────────────────────────────────────────────
    f += seccion("Cierre", "Nombres de archivo y revisión")
    f.append(tabla(
        ["Pieza", "Nombre de archivo"],
        [["A · fijos", "fijo-mc.mov · fijo-qr.mov · fijo-jurado.mov"],
         ["B · participantes", "rotulo-participante-con-pais.png · rotulo-participante-sin-pais.png"],
         ["C · portadas", "portada-01-bachata-solista-femenino.png … portada-11-salsa-equipos.png"],
         ["Editables", "/editables con los .psd o .ai y las fuentes"]],
        [98, ANCHO - 98],
        monos=(1,),
    ))
    f.append(p("Antes de dar por buena la entrega", "h3"))
    f.append(Spacer(1, 2))
    f.append(Checklist([
        "Todo mide 1920 × 1080 exactos, en sRGB.",
        "Los PNG de las piezas A y B tienen canal alfa de verdad: se ven a cuadros al abrirlos, no con fondo blanco.",
        "La plantilla de participante no tiene ni una letra escrita.",
        "Están las dos variantes, con país y sin país, y la de equipos no deja hueco vacío.",
        "Se ha probado con «Martin Salgado Dance Company» y con «España / República Dominicana», y ninguno se sale ni se corta.",
        "Ningún texto se sale del rectángulo de título seguro.",
        "Ningún texto baja de 36 px.",
        "El QR mide 320 px o más, es oscuro sobre claro y tiene su margen limpio alrededor.",
        "Los MOV llevan alfa — ProRes 4444 o Animation, nunca H.264.",
        "Van los archivos editables sin aplanar y las fuentes.",
        "Salsa y Bachata se distinguen sin leer el texto.",
    ]))
    f += aviso("Un aviso que no es para el diseñador", [
        "La hoja de cálculo de la que salen los nombres viene con basura: hay fichas guardadas "
        "como alma-dance-company o Ismael-Palmar-VENEZUELA, con guiones en vez de espacios, y "
        "el mismo país escrito de dos maneras («Rumania» y «Rumanía»).",
        "Eso saldrá tal cual en pantalla por muy bien que esté la plantilla. Conviene repasar "
        "la hoja antes del directo: es trabajo de datos, no de diseño.",
    ])

    doc.build(f)
    print("PDF escrito en", SALIDA, "·", os.path.getsize(SALIDA) // 1024, "KB")


if __name__ == "__main__":
    construir()
