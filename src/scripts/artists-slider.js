// Slider de avatares "blob" (mismo comportamiento que los artistas de la home):
// activa el morph del blob (clase js-fx, definida en proposal.css) y anima el
// carrusel automático + arrastre con inercia. Se importa donde haya [data-artists-slider].
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduce) document.documentElement.classList.add("js-fx");

const artSlider = document.querySelector("[data-artists-slider]");
if (artSlider && !reduce) {
  const artTrack = artSlider.querySelector(".p-artists-track");
  let ax = 0, hoverPause = false, artDragging = false, artMoved = false;
  let artStartX = 0, artStartAx = 0, artVel = 0, artLastX = 0, artLastT = 0, artResumeAt = 0;
  const artWrap = () => {
    const half = artTrack.scrollWidth / 2;
    if (half > 0) { ax %= half; if (ax > 0) ax -= half; }
  };
  if (matchMedia("(hover: hover)").matches) {
    artSlider.addEventListener("mouseenter", () => { hoverPause = true; });
    artSlider.addEventListener("mouseleave", () => { hoverPause = false; });
  }
  artSlider.addEventListener("pointerdown", (e) => {
    artDragging = true; artMoved = false; artVel = 0;
    artStartX = e.clientX; artStartAx = ax; artLastX = e.clientX; artLastT = performance.now();
    // OJO: no capturamos el puntero aquí. Si lo hiciéramos, un clic simple en un enlace
    // (p. ej. las burbujas de redes) no navegaría porque el "click" iría al slider.
  });
  artSlider.addEventListener("pointermove", (e) => {
    if (!artDragging) return;
    const dx = e.clientX - artStartX;
    if (Math.abs(dx) > 4 && !artMoved) {
      artMoved = true;
      // Solo al arrastrar de verdad capturamos el puntero, para seguirlo aunque salga del slider.
      if (artSlider.setPointerCapture) { try { artSlider.setPointerCapture(e.pointerId); } catch (_) {} }
    }
    ax = artStartAx + dx; artWrap();
    const now = performance.now(), dt = Math.max(now - artLastT, 1);
    artVel = ((e.clientX - artLastX) / dt) * 16.7; // px por frame
    artLastX = e.clientX; artLastT = now;
  });
  const artEndDrag = () => {
    if (!artDragging) return;
    artDragging = false;
    artResumeAt = performance.now() + 1600; // respiro antes de reanudar el auto
  };
  artSlider.addEventListener("pointerup", artEndDrag);
  artSlider.addEventListener("pointercancel", artEndDrag);
  // un arrastre no debe disparar clics/enlaces dentro del slider
  artSlider.addEventListener("click", (e) => { if (artMoved) { e.preventDefault(); e.stopPropagation(); } }, true);
  requestAnimationFrame(function artTick() {
    if (artDragging) {
      // el usuario controla
    } else if (Math.abs(artVel) > 0.2) {
      ax += artVel; artVel *= 0.94; artWrap(); // inercia con frenado suave
    } else if (!hoverPause && performance.now() >= artResumeAt) {
      ax -= 0.3; artWrap();
    }
    artTrack.style.transform = "translateX(" + ax.toFixed(1) + "px)";
    requestAnimationFrame(artTick);
  });
}
