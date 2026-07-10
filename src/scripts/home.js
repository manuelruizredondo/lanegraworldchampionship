// Efectos e interacciones de la home (La Negra World Championship).
// DOM-based; se importa desde cada home (es / en / it).

    // Marquee estilo sundayapp: desplazamiento continuo que ACELERA con el scroll + skew según dirección
    const mq = document.querySelector("[data-marquee]");
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (mq && !reduceMotion) {
      const track = mq.querySelector(".p-marquee-track");
      const BASE = 0.5; // px por frame en reposo
      let x = 0, boost = 0, skewT = 0, skew = 0;
      let lastY = window.scrollY, lastT = performance.now();
      window.addEventListener("scroll", () => {
        const now = performance.now();
        const dt = Math.max(now - lastT, 1);
        const v = (window.scrollY - lastY) / dt; // px/ms
        lastY = window.scrollY; lastT = now;
        boost = Math.min(18, Math.abs(v) * 10);     // más rápido cuanto más rápido el scroll
        skewT = Math.max(-12, Math.min(12, v * 8)); // inclinación según dirección
      }, { passive: true });
      (function tick() {
        boost *= 0.94;
        skewT *= 0.92;
        skew += (skewT - skew) * 0.1;
        x -= BASE + boost;
        const half = track.scrollWidth / 2;
        if (half > 0 && -x >= half) x += half; // loop perfecto
        track.style.transform = `translateX(${x}px)`;
        mq.style.transform = `skewX(${skew.toFixed(2)}deg)`;
        requestAnimationFrame(tick);
      })();
    }

    // Efectos: reveal on scroll, contadores, parallax, botones magnéticos, cursor y zoom-out del hero
    const fxReduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = matchMedia("(pointer: fine)").matches;
    if (!fxReduce) {
      document.documentElement.classList.add("js-fx");

      // 1) Reveal on scroll con stagger — se inicia tras cargar la fuente
      // (los titulares se parten por líneas visuales y eso depende de la métrica tipográfica)
      document.fonts.ready.then(() => {
        const revealEls = [];
        const splitPhrases = (el) => {
          const parts = el.innerHTML.split(/<br[^>]*>/i);
          if (parts.length > 1) {
            // con <br>: cada frase manual es una línea
            el.innerHTML = parts
              .map((p) => '<span class="rv-line"><span class="rv-line-inner">' + p + "</span></span>")
              .join("");
          } else {
            // sin <br>: partir por líneas visuales (los spans tipo .p-hl se tratan como unidades)
            const nodes = [];
            [...el.childNodes].forEach((node) => {
              if (node.nodeType === 3) {
                node.textContent.split(/(\s+)/).forEach((tok) => {
                  if (!tok) return;
                  if (/^\s+$/.test(tok)) nodes.push(document.createTextNode(" "));
                  else { const w = document.createElement("span"); w.textContent = tok; nodes.push(w); }
                });
              } else nodes.push(node);
            });
            el.innerHTML = "";
            nodes.forEach((n) => el.appendChild(n));
            const lines = [];
            let prevLeft = null;
            nodes.forEach((n) => {
              if (n.nodeType === 3) { if (lines.length) lines[lines.length - 1].push(n); return; }
              // nueva línea cuando la posición horizontal retrocede (salto de línea real);
              // el top no sirve: los resaltados inline-block tienen caja con top distinto
              const left = n.getBoundingClientRect().left;
              if (prevLeft === null || left < prevLeft) lines.push([n]);
              else lines[lines.length - 1].push(n);
              prevLeft = left;
            });
            el.innerHTML = "";
            lines.forEach((g) => {
              const line = document.createElement("span"); line.className = "rv-line";
              const inner = document.createElement("span"); inner.className = "rv-line-inner";
              g.forEach((n) => inner.appendChild(n));
              line.appendChild(inner);
              el.appendChild(line);
            });
          }
          [...el.querySelectorAll(".rv-line-inner")].forEach((line, li) => {
            line.style.transitionDelay = "calc(var(--rv-d, 0ms) + " + (li * 170) + "ms)";
          });
        };
        const addRv = (el, i) => {
          const cls = el.matches(".p-display, .p-h2, .p-band-title") ? "rv-mask" : "rv";
          el.classList.add(cls);
          if (el.matches(".p-pillar, .p-card")) el.classList.add("rv-scale");
          el.style.setProperty("--rv-d", Math.min(i * 90, 450) + "ms");
          if (cls === "rv-mask") splitPhrases(el);
          revealEls.push(el);
        };
        document
          .querySelectorAll(".p-intro, .p-split, .p-narrow, .p-values, .p-values-list, .p-stats-row, .p-pillars, .p-cards, .p-band-content, .p-final-inner")
          .forEach((parent) => {
            [...parent.children].forEach((el, i) => {
              if (!el.matches(".p-values-list, .p-pillars-plus")) addRv(el, i);
            });
          });
        const io = new IntersectionObserver((ents) => {
          ents.forEach((e) => {
            if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
          });
        }, { threshold: [0, 0.15], rootMargin: "14% 0px -6% 0px" });
        revealEls.forEach((el) => io.observe(el));
        // Barrido de seguridad: revela todo lo que ya haya entrado (o pasado) el viewport,
        // por si un scroll brusco se salta al observer. Nada puede quedar oculto.
        let sweepTick = false;
        const sweep = () => {
          sweepTick = false;
          revealEls.forEach((el) => {
            if (el.classList.contains("in")) return;
            if (el.getBoundingClientRect().top < innerHeight * 0.94) {
              el.classList.add("in");
              io.unobserve(el);
            }
          });
        };
        addEventListener("scroll", () => {
          if (!sweepTick) { sweepTick = true; requestAnimationFrame(sweep); }
        }, { passive: true });
        sweep();
      });

      // 2) Contadores animados en las stats
      document.querySelectorAll(".p-stat-n").forEach((el) => {
        const m = el.textContent.trim().match(/^([\d.]+)(.*)$/);
        if (!m) return;
        const target = parseInt(m[1].replace(/\./g, ""), 10);
        const suffix = m[2] || "";
        const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        const obs = new IntersectionObserver((ents) => {
          if (!ents[0].isIntersecting) return;
          obs.disconnect();
          const t0 = performance.now(), DUR = 1400;
          requestAnimationFrame(function step(t) {
            const p = Math.min((t - t0) / DUR, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = fmt(Math.round(target * eased)) + suffix;
            if (p < 1) requestAnimationFrame(step);
          });
        }, { threshold: 0.6 });
        obs.observe(el);
      });

      // 3+9) Parallax (banda de foto y foto de valores) + zoom-out del hero — un solo rAF
      const bandImg = document.querySelector(".p-band img");
      const valuesImg = document.querySelector(".p-values-media img");
      const hero = document.querySelector(".p-hero");
      const heroInner = document.querySelector(".p-hero-inner");
      requestAnimationFrame(function fxTick() {
        const vh = innerHeight;
        if (bandImg) {
          const r = bandImg.parentElement.getBoundingClientRect();
          if (r.bottom > 0 && r.top < vh) {
            const p = (r.top + r.height / 2 - vh / 2) / vh;
            bandImg.style.transform = "translateY(" + (-11.5 + p * 23).toFixed(2) + "%)";
          }
        }
        if (valuesImg) {
          const r = valuesImg.parentElement.getBoundingClientRect();
          if (r.bottom > 0 && r.top < vh) {
            const p = (r.top + r.height / 2 - vh / 2) / vh;
            valuesImg.style.transform = "translateY(" + (-11 + p * 9).toFixed(2) + "%)";
          }
        }
        if (hero && heroInner) {
          const prog = Math.min(Math.max(scrollY / (hero.offsetHeight || vh), 0), 1);
          heroInner.style.transform = "scale(" + (1 - prog * 0.08).toFixed(4) + ")";
          heroInner.style.opacity = String(1 - prog * 0.55);
        }
        requestAnimationFrame(fxTick);
      });

      // Slider de artistas: automático + arrastre con dedo/ratón con inercia
      const artSlider = document.querySelector("[data-artists-slider]");
      if (artSlider) {
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
          if (artSlider.setPointerCapture) { try { artSlider.setPointerCapture(e.pointerId); } catch (_) {} }
        });
        artSlider.addEventListener("pointermove", (e) => {
          if (!artDragging) return;
          const dx = e.clientX - artStartX;
          if (Math.abs(dx) > 4) artMoved = true;
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

      // Mapa: pop de burbujas + contadores al entrar en pantalla
      const mapEl = document.querySelector("[data-map]");
      if (mapEl) {
        const mapObs = new IntersectionObserver((ents) => {
          if (!ents[0].isIntersecting) return;
          mapObs.disconnect();
          mapEl.classList.add("in");
        }, { threshold: 0.3 });
        mapObs.observe(mapEl);
        // el número cuenta la primera vez que haces rollover en cada punto
        mapEl.querySelectorAll(".p-pin").forEach((pin) => {
          let contado = false;
          pin.addEventListener("mouseenter", () => {
            if (contado) return;
            contado = true;
            const el = pin.querySelector(".p-pin-n");
            const target = parseInt(el.dataset.count, 10) || 0;
            const t0 = performance.now(), DUR = 900;
            requestAnimationFrame(function step(t) {
              const p = Math.min((t - t0) / DUR, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              el.textContent = String(Math.round(target * eased)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
              if (p < 1) requestAnimationFrame(step);
            });
          });
        });
      }

      // 4) Botones magnéticos
      if (finePointer) {
        document.querySelectorAll(".p-btn").forEach((btn) => {
          btn.addEventListener("mousemove", (e) => {
            const r = btn.getBoundingClientRect();
            const mx = Math.max(-6, Math.min(6, (e.clientX - r.left - r.width / 2) * 0.18));
            const my = Math.max(-5, Math.min(5, (e.clientY - r.top - r.height / 2) * 0.3));
            btn.style.transform = "translate(" + mx.toFixed(1) + "px, " + my.toFixed(1) + "px)";
          });
          btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
        });
      }

      // 7) Cursor: punto dorado que sigue al ratón y crece sobre enlaces
      if (finePointer) {
        const dot = document.createElement("div");
        Object.assign(dot.style, {
          position: "fixed", left: "0", top: "0", width: "10px", height: "10px",
          borderRadius: "50%", background: "#cc9933", pointerEvents: "none",
          zIndex: "9999", opacity: "0", transition: "opacity .3s ease",
        });
        document.body.appendChild(dot);
        let cx = -100, cy = -100, tx = -100, ty = -100, sc = 1, scT = 1;
        addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; dot.style.opacity = "0.85"; });
        document.addEventListener("mouseover", (e) => { scT = e.target.closest("a, button, select") ? 3.2 : 1; });
        document.addEventListener("mouseleave", () => { dot.style.opacity = "0"; });
        requestAnimationFrame(function cur() {
          cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22;
          sc += (scT - sc) * 0.18;
          dot.style.transform = "translate(" + (cx - 5) + "px, " + (cy - 5) + "px) scale(" + sc.toFixed(2) + ")";
          dot.style.opacity = scT > 1 ? "0.35" : dot.style.opacity;
          requestAnimationFrame(cur);
        });
      }
    }

    // Posicionar los pins sobre el mapa inclinado (misma proyección que la CSS de la imagen)
    const mapPlane = document.querySelector(".p-map-plane");
    const mapImg = document.querySelector(".p-map-img");
    const MAP_AR = 2370 / 1104;
    const layoutPins = () => {
      if (!mapPlane || !mapImg) return;
      const W = mapImg.offsetWidth;
      if (!W) { setTimeout(layoutPins, 120); return; } // aún sin ancho de layout
      // El SVG con solo viewBox puede reportar offsetHeight 0: derivamos H del aspect ratio
      const H = mapImg.offsetHeight || W / MAP_AR;
      const D = 1400, TH = Math.PI / 4, S = 1.16;
      mapPlane.querySelectorAll(".p-pin").forEach((pin) => {
        const x = parseFloat(pin.dataset.x), y = parseFloat(pin.dataset.y);
        const X = (x / 100 - 0.5) * W * S;
        const Y = (y / 100 - 0.5) * H * S;
        const z = Y * Math.sin(TH);
        const f = D / (D - z);
        pin.style.left = (W / 2 + X * f).toFixed(1) + "px";
        pin.style.top = (H / 2 + Y * Math.cos(TH) * f).toFixed(1) + "px";
        pin.style.setProperty("--proj", Math.max(0.7, Math.min(1.3, f)).toFixed(3));
      });
    };
    if (mapImg) {
      mapImg.addEventListener("load", layoutPins);
      addEventListener("load", layoutPins);
      addEventListener("resize", layoutPins);
      layoutPins();
    }

    // Cuenta atrás del hero hasta el inicio del evento (21 oct 2026, hora de España)
    const hcTarget = new Date("2026-10-21T00:00:00+02:00").getTime();
    const hc = {
      d: document.querySelector(".p-hero-count [data-d]"),
      h: document.querySelector(".p-hero-count [data-h]"),
      m: document.querySelector(".p-hero-count [data-m]"),
      s: document.querySelector(".p-hero-count [data-s]"),
    };
    const hcPad = (n) => String(n).padStart(2, "0");
    const hcTick = () => {
      const diff = Math.max(0, hcTarget - Date.now());
      if (hc.d) hc.d.textContent = String(Math.floor(diff / 864e5));
      if (hc.h) hc.h.textContent = hcPad(Math.floor(diff / 36e5) % 24);
      if (hc.m) hc.m.textContent = hcPad(Math.floor(diff / 6e4) % 60);
      if (hc.s) hc.s.textContent = hcPad(Math.floor(diff / 1e3) % 60);
    };
    if (hc.d) { hcTick(); setInterval(hcTick, 1000); }

    // Valores: al pulsar Nivel / Comunidad / Emoción cambia la imagen
    const valueItems = document.querySelectorAll(".p-value");
    const valuesMediaImg = document.querySelector(".p-values-media img");
    const selectValue = (v) => {
      valueItems.forEach((o) => o.classList.remove("active"));
      v.classList.add("active");
      const src = v.dataset.img;
      if (src && valuesMediaImg && valuesMediaImg.getAttribute("src") !== src) {
        valuesMediaImg.style.opacity = "0";
        setTimeout(() => {
          valuesMediaImg.onload = () => { valuesMediaImg.style.opacity = "1"; };
          valuesMediaImg.src = src;
        }, 200);
      }
    };
    valueItems.forEach((v) => {
      v.addEventListener("click", () => selectValue(v));
      v.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectValue(v); }
      });
    });
