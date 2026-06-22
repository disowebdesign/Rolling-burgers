import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.from('.nav',              { y: -60, opacity: 0, duration: 0.7 }, 0)
  tl.from('.hero-bg-line',     { scale: 0.8, opacity: 0, duration: 1.0, stagger: 0.12 }, 0.15)
  tl.from('.hero-burger-wrap', { y: 100, opacity: 0, duration: 1.1, ease: 'power4.out' }, 0.3)
  tl.fromTo('.hero-tag',
    { opacity: 0, scale: 0.4, rotation: 0 },
    { opacity: 1, scale: 1,   rotation: 0, duration: 0.55, stagger: 0.15, clearProps: 'scale,opacity,rotation,transform' },
    0.85
  )
  tl.from('.hero-copy-left, .hero-copy-right', { opacity: 0, y: 20, duration: 0.6, stagger: 0.1 }, 1.1)

  gsap.to('.hero-burger-wrap', {
    y: -14, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.5
  })

  document.addEventListener('mousemove', (e) => {
    const xPct = (e.clientX / window.innerWidth  - 0.5) * 20
    const yPct = (e.clientY / window.innerHeight - 0.5) * 9
    gsap.to('.hero-bg-text', { x: xPct, y: yPct, duration: 1.2, ease: 'power1.out' })
    gsap.to('.hero-burger-wrap', { x: xPct * 0.3, duration: 1.5, ease: 'power1.out' })
  })
}

export function initBubbles() {
  const container = document.querySelector('.wave-transition')
  if (!container) return
  const sizes    = [8, 12, 16, 20, 10, 14, 18, 9, 22, 11]
  const delays   = [0, 0.4, 0.8, 1.3, 1.8, 0.2, 1.0, 1.6, 0.6, 2.0]
  const durations= [2.8, 3.4, 2.5, 3.8, 3.1, 2.9, 3.6, 2.7, 4.0, 3.2]
  sizes.forEach((size, i) => {
    const b = document.createElement('div')
    b.classList.add('bubble')
    b.style.cssText = `width:${size}px;height:${size}px;left:${8+i*9}%;animation-duration:${durations[i]}s;animation-delay:${delays[i]}s;`
    container.appendChild(b)
  })
}

/* ══════════════════════════════════════════════════════════════
   OLAS DE LOS DIVISORES — entre secciones (hero→wreckage,
   wreckage→banda, etc.)
   Cada .music-divider tiene 3 capas .wave (yellow/burger/red).
   Al hacer scroll hacia el divisor, las capas suben desde abajo
   con un pequeño retraso entre sí (sensación de profundidad), y
   una vez visibles se mecen en un oleaje continuo y suave.
══════════════════════════════════════════════════════════════ */
export function initDividerWaves() {
  document.querySelectorAll('.music-divider').forEach(divider => {
    const waves = divider.querySelectorAll('.wave')
    if (!waves.length) return

    // Estado inicial: las olas están ocultas, por debajo del divisor
    gsap.set(waves, { yPercent: 100 })

    // ── Marea: las olas suben a medida que el divisor entra en pantalla ──
    ScrollTrigger.create({
      trigger: divider,
      start: 'top bottom',
      end: 'bottom center',
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress
        waves.forEach((wave, i) => {
          // cada capa sube con un pequeño retraso, dando sensación de profundidad
          const delay = i * 0.15
          const rise = gsap.utils.clamp(0, 1, (p - delay) / (1 - delay))
          gsap.set(wave, { yPercent: (1 - rise) * 100 })
        })
      }
    })

    // ── Oleaje: cada capa se mece verticalmente a su propio ritmo, en loop ──
    waves.forEach((wave, i) => {
      gsap.to(wave, {
        y: i % 2 === 0 ? '+=8' : '-=8',
        duration: 2.6 + i * 0.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    })
  })
}

/* ══════════════════════════════════════════════════════════════
   SCROLL ANIMATIONS
   Aparición de textos (split por letras/palabras), fotos/cards
   y divisores al hacer scroll. Usa ScrollTrigger + GSAP.

   Clases que se animan automáticamente:
     .anim-chars     → cada letra cae desde arriba con stagger
     .anim-words     → cada palabra aparece con stagger
     .anim-fade-up   → fade + sube desde abajo (párrafos, badges)
     .anim-fade-in   → fade simple (imágenes, SVG escenario)
     .anim-slide-left / .anim-slide-right → slides laterales
     .anim-scale-in  → escala desde 0.7 (stickers, stats)
     .anim-divider   → las olas de divisor se dibujan/escalan

   Para los divisores SVG ya existentes (music-divider) se añade
   un pin de scale que los hace "crecer" al entrar en pantalla.
══════════════════════════════════════════════════════════════ */
export function initScrollAnimations() {

  // ─── Utilidad: split texto en <span> por char ────────────────
  function splitChars(el) {
    el.style.overflow = 'hidden'
    const nodes = [...el.childNodes]
    el.textContent = ''
    const spans = []
    nodes.forEach(node => {
      if (node.nodeName === 'BR') {
        el.appendChild(document.createElement('br'))
        return
      }
      const text = node.textContent || '';
      [...text].forEach(ch => {
        const span = document.createElement('span')
        span.style.cssText = 'display:inline-block; will-change:transform,opacity;'
        span.textContent = ch === ' ' ? '\u00A0' : ch
        el.appendChild(span)
        spans.push(span)
      })
    })
    return spans
  }

  // ─── Utilidad: split texto en <span> por palabra ─────────────
  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/)
    el.innerHTML = words
      .map(w => `<span style="display:inline-block;overflow:hidden;"><span style="display:inline-block;will-change:transform,opacity;">${w}</span></span>`)
      .join(' ')
    return [...el.querySelectorAll('span > span')]
  }

  // ─── Defaults de ScrollTrigger ───────────────────────────────
  const ST_DEFAULTS = { start: 'top 88%', toggleActions: 'play none none none' }

  // ══ 1. CHARS — letras cayendo (wh-line, banda-title, nos-headline) ══
  document.querySelectorAll('.anim-chars, .wh-line, .banda-title, .nos-hl-line').forEach(el => {
    const chars = splitChars(el)
    gsap.from(chars, {
      y: '-110%',
      opacity: 0,
      duration: 0.55,
      ease: 'power3.out',
      stagger: 0.04,
      scrollTrigger: { trigger: el, ...ST_DEFAULTS }
    })
  })

  // ══ 2. WORDS — palabras aparecen (wreckage-desc, nos-body) ══
  document.querySelectorAll('.anim-words, .wreckage-desc, .nos-body, .nos-manifest-quote').forEach(el => {
    const words = splitWords(el)
    gsap.from(words, {
      y: '100%',
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.055,
      scrollTrigger: { trigger: el, ...ST_DEFAULTS }
    })
  })

  // ══ 3. FADE UP — badges, eyebrows, CTAs, párrafos cortos ══
  document.querySelectorAll([
    '.anim-fade-up',
    '.wreckage-badge',
    '.wreckage-cta',
    '.banda-eyebrow',
    '.nos-sticker',
    '.nos-manifest-label',
    '.nos-manifest-author',
    '.contacto-eyebrow',
    '.contacto-subtitle',
  ].join(',')).forEach(el => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, ...ST_DEFAULTS }
    })
  })

  // ══ 4. FADE IN — SVG escenario, fotos nos-photo ══
  document.querySelectorAll([
    '.anim-fade-in',
    '.concert-stage-wrap',
    '.nos-photo',
    '.contacto-map',
  ].join(',')).forEach(el => {
    gsap.from(el, {
      opacity: 0,
      duration: 1.1,
      ease: 'power1.out',
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
    })
  })

  // ══ 5. SLIDE LEFT / RIGHT — bloques nosotros ══
  document.querySelectorAll('.nos-half--photo, .nos-half--photo-red').forEach(el => {
    gsap.from(el, {
      x: -80,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, ...ST_DEFAULTS }
    })
  })
  document.querySelectorAll('.nos-half--text').forEach(el => {
    gsap.from(el, {
      x: 80,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, ...ST_DEFAULTS }
    })
  })

  // ══ 6. SCALE IN — stats, stickers ══
  document.querySelectorAll('.nos-stat, .anim-scale-in').forEach((el, i) => {
    gsap.from(el, {
      scale: 0.6,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
      delay: i * 0.08,
      scrollTrigger: { trigger: el, ...ST_DEFAULTS }
    })
  })

  // ══ 7. NOS STAT NUMBERS — contador animado ══
  document.querySelectorAll('.nos-stat-num').forEach(el => {
    const raw   = el.textContent.trim()
    const num   = parseFloat(raw)
    const suffix = raw.replace(/[\d.]/g, '')   // ej "+" o ""
    if (!isNaN(num)) {
      const obj = { val: 0 }
      gsap.to(obj, {
        val: num,
        duration: 1.8,
        ease: 'power2.out',
        snap: { val: num < 10 ? 0.1 : 1 },
        onUpdate: () => { el.textContent = (num % 1 === 0 ? Math.round(obj.val) : obj.val.toFixed(1)) + suffix },
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      })
    }
  })

  // ══ 8. (las olas de los divisores ahora las maneja initDividerWaves) ══

  // ══ 9. CONTACTO INFO ITEMS — aparecen uno a uno ══
  document.querySelectorAll('.contacto-item').forEach((el, i) => {
    gsap.from(el, {
      x: -50,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      delay: i * 0.1,
      scrollTrigger: { trigger: el, ...ST_DEFAULTS }
    })
  })

  // ══ 10. FORM FIELDS — appear in sequence ══
  document.querySelectorAll('.contacto-field, .contacto-submit').forEach((el, i) => {
    gsap.from(el, {
      y: 30,
      opacity: 0,
      duration: 0.55,
      ease: 'power2.out',
      delay: i * 0.1,
      scrollTrigger: { trigger: el, ...ST_DEFAULTS }
    })
  })

  // ══ 11. WRECKAGE HEADLINE — letras desde abajo con un rebote ══
  document.querySelectorAll('.wh-line').forEach((el, i) => {
    // ya lo splitteamos en el paso 1, aquí solo ajustamos el ease por línea
    // (el stagger del paso 1 ya los cubre; este bloque queda como fallback)
  })

  // ══ 12. CONCERT STAGE — spotlight pulse al entrar ══
  const stage = document.querySelector('.concert-stage-wrap')
  if (stage) {
    ScrollTrigger.create({
      trigger: stage,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        // pequeño "flash" de los focos al aparecer el escenario
        const lights = stage.querySelectorAll('ellipse[filter]')
        gsap.from(lights, {
          opacity: 0,
          duration: 0.05,
          stagger: { each: 0.07, from: 'random' },
          yoyo: true,
          repeat: 3,
        })
      }
    })
  }

  // ══ 13. TICKER BAND — aparece deslizándose desde abajo ══
  const ticker = document.querySelector('.nos-ticker')
  if (ticker) {
    gsap.from(ticker, {
      y: 60,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: ticker, start: 'top 95%', toggleActions: 'play none none none' }
    })
  }

}
