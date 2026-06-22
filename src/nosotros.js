import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── Utilidad: split texto en <span> por char, con overflow oculto ── */
function splitChars(el) {
  const text = el.textContent
  el.textContent = ''
  const wrapper = document.createElement('span')
  wrapper.style.cssText = 'display:block; overflow:hidden;'
  const chars = [...text].map(ch => {
    const span = document.createElement('span')
    span.style.cssText = 'display:inline-block; will-change:transform,opacity;'
    span.textContent = ch === ' ' ? '\u00A0' : ch
    wrapper.appendChild(span)
    return span
  })
  el.appendChild(wrapper)
  return chars
}

/* ── Utilidad: split texto en <span> por palabra ── */
function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/)
  el.innerHTML = words
    .map(w => `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;"><span style="display:inline-block;will-change:transform,opacity;">${w}</span></span>`)
    .join(' ')
  return [...el.querySelectorAll('span > span')]
}

export function initNosotros() {

  const ST = { toggleActions: 'play none none none', once: true }

  /* ══ BLOQUE 1 — CREMA ══════════════════════════════════════ */

  // Sticker entra girando
  gsap.from('.nos-block--cream .nos-sticker', {
    opacity: 0, scale: 0.3, rotation: -20, duration: 0.7,
    ease: 'back.out(2)',
    scrollTrigger: { trigger: '.nos-block--cream .nos-sticker', start: 'top 88%', ...ST }
  })

  // Headlines: letras caen de arriba, línea por línea
  document.querySelectorAll('.nos-block--cream .nos-hl-line').forEach((line, i) => {
    const chars = splitChars(line)
    gsap.from(chars, {
      y: '-110%',
      opacity: 0,
      duration: 0.55,
      ease: 'power3.out',
      stagger: 0.035,
      delay: i * 0.12,
      scrollTrigger: { trigger: line, start: 'top 88%', ...ST }
    })
  })

  // Body: palabras suben una a una
  const bodyEl1 = document.querySelector('.nos-block--cream .nos-body')
  if (bodyEl1) {
    const words = splitWords(bodyEl1)
    gsap.from(words, {
      y: '100%', opacity: 0, duration: 0.45, ease: 'power2.out', stagger: 0.045,
      scrollTrigger: { trigger: bodyEl1, start: 'top 88%', ...ST }
    })
  }

  // Foto: zoom out + fade
  gsap.from('.nos-block--cream .nos-photo', {
    opacity: 0, scale: 1.1, duration: 1.1, ease: 'power2.out',
    scrollTrigger: { trigger: '.nos-block--cream .nos-photo', start: 'top 88%', ...ST }
  })

  /* ── Ola crema → rojo ── */
  gsap.from('.nos-wave--to-red svg path', {
    scrollTrigger: { trigger: '.nos-wave--to-red', start: 'top 90%', end: 'bottom center', scrub: 0.6 },
    attr: { d: 'M0,160 L0,160 C200,160 420,160 640,160 C860,160 1060,160 1280,160 C1370,160 1415,160 1440,160 L1440,160 Z' }
  })

  /* ══ BLOQUE 2 — ROJO ══════════════════════════════════════ */

  gsap.from('.nos-block--red .nos-sticker', {
    opacity: 0, scale: 0.3, rotation: 18, duration: 0.7, ease: 'back.out(2)',
    scrollTrigger: { trigger: '.nos-block--red .nos-sticker', start: 'top 88%', ...ST }
  })

  document.querySelectorAll('.nos-block--red .nos-hl-line').forEach((line, i) => {
    const chars = splitChars(line)
    gsap.from(chars, {
      y: '-110%', opacity: 0, duration: 0.55, ease: 'power3.out', stagger: 0.035,
      delay: i * 0.12,
      scrollTrigger: { trigger: line, start: 'top 88%', ...ST }
    })
  })

  const bodyEl2 = document.querySelector('.nos-block--red .nos-body')
  if (bodyEl2) {
    const words = splitWords(bodyEl2)
    gsap.from(words, {
      y: '100%', opacity: 0, duration: 0.45, ease: 'power2.out', stagger: 0.045,
      scrollTrigger: { trigger: bodyEl2, start: 'top 88%', ...ST }
    })
  }

  // Foto entra desde la derecha
  gsap.from('.nos-block--red .nos-photo', {
    opacity: 0, x: 100, duration: 1.0, ease: 'power3.out',
    scrollTrigger: { trigger: '.nos-block--red .nos-photo', start: 'top 88%', ...ST }
  })

  /* ── Ola rojo → dark ── */
  gsap.from('.nos-wave--to-dark svg path', {
    scrollTrigger: { trigger: '.nos-wave--to-dark', start: 'top 90%', end: 'bottom center', scrub: 0.6 },
    attr: { d: 'M0,160 L0,160 C240,160 500,160 760,160 C1020,160 1200,160 1440,160 L1440,160 Z' }
  })

  /* ══ BLOQUE 3 — DARK: manifiesto + stats ══════════════════ */

  gsap.from('.nos-manifest-label', {
    opacity: 0, x: -40, duration: 0.6, ease: 'power3.out',
    scrollTrigger: { trigger: '.nos-manifest-label', start: 'top 88%', ...ST }
  })

  // Cita: palabras aparecen una a una
  const quoteEl = document.querySelector('.nos-manifest-quote')
  if (quoteEl) {
    const words = splitWords(quoteEl)
    gsap.from(words, {
      y: '100%', opacity: 0, duration: 0.5, ease: 'power2.out', stagger: 0.04,
      scrollTrigger: { trigger: quoteEl, start: 'top 88%', ...ST }
    })
  }

  gsap.from('.nos-manifest-author', {
    opacity: 0, y: 20, duration: 0.6, ease: 'power2.out', delay: 0.2,
    scrollTrigger: { trigger: '.nos-manifest-author', start: 'top 92%', ...ST }
  })

  // Stats: entran escalonados + rebote
  gsap.from('.nos-stat', {
    opacity: 0, y: 50, duration: 0.65, ease: 'back.out(1.6)', stagger: 0.15,
    scrollTrigger: { trigger: '.nos-stats', start: 'top 85%', ...ST }
  })

  // Números: count-up animado
  document.querySelectorAll('.nos-stat-num').forEach((el) => {
    const raw    = el.textContent.trim()
    const isPlus = raw.includes('+')
    const isM    = raw.toLowerCase().includes('m')
    const num    = parseFloat(raw.replace(/[^\d.]/g, ''))
    if (isNaN(num)) return
    const suffix = isM ? 'M+' : isPlus ? '+' : ''
    const obj = { val: 0 }
    gsap.to(obj, {
      val: num,
      duration: 1.8,
      ease: 'power2.out',
      snap: { val: num < 10 ? 0.1 : 1 },
      onUpdate() {
        el.textContent = (num % 1 === 0 ? Math.round(obj.val) : obj.val.toFixed(1)) + suffix
      },
      scrollTrigger: { trigger: el, start: 'top 85%', ...ST }
    })
  })

  /* ── Ola superior nos-wave-top ── */
  gsap.from('.nos-wave-path-top', {
    scrollTrigger: { trigger: '.nos-wave-top', start: 'top 90%', end: 'bottom center', scrub: 0.6 },
    attr: { d: 'M0,160 L0,160 C200,160 400,160 650,160 C900,160 1100,160 1300,160 C1380,160 1420,160 1440,160 L1440,160 Z' }
  })

  /* ── Parallax sutil en fotos ── */
  gsap.utils.toArray('.nos-photo').forEach(img => {
    gsap.to(img, {
      y: -40, ease: 'none',
      scrollTrigger: {
        trigger: img.closest('.nos-half--photo, .nos-half--photo-red') || img,
        start: 'top bottom', end: 'bottom top', scrub: true
      }
    })
  })

  /* ── Ticker: aparece desde abajo ── */
  gsap.from('.nos-ticker', {
    y: 60, opacity: 0, duration: 0.7, ease: 'power3.out',
    scrollTrigger: { trigger: '.nos-ticker', start: 'top 95%', ...ST }
  })
}
