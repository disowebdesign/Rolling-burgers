import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── Utilidad: split texto en <span> por char ── */
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

export function initContacto() {

  const ST = { toggleActions: 'play none none none', once: true }

  /* ══ HEADER ════════════════════════════════════════════════ */

  // Eyebrow: fade + sube
  gsap.from('.contacto-eyebrow', {
    opacity: 0, y: 30, duration: 0.6, ease: 'power3.out',
    scrollTrigger: { trigger: '.contacto-eyebrow', start: 'top 88%', ...ST }
  })

  // Título: letras caen de arriba, una a una
  const titleEl = document.querySelector('.contacto-title')
  if (titleEl) {
    const chars = splitChars(titleEl)
    gsap.from(chars, {
      y: '-120%', opacity: 0, duration: 0.55, ease: 'power3.out', stagger: 0.04,
      scrollTrigger: { trigger: titleEl, start: 'top 88%', ...ST }
    })
  }

  // Subtitle: palabras suben
  const subtitleEl = document.querySelector('.contacto-subtitle')
  if (subtitleEl) {
    const words = splitWords(subtitleEl)
    gsap.from(words, {
      y: '100%', opacity: 0, duration: 0.45, ease: 'power2.out', stagger: 0.055,
      scrollTrigger: { trigger: subtitleEl, start: 'top 88%', ...ST }
    })
  }

  /* ══ INFO DE CONTACTO ══════════════════════════════════════ */

  // Cada ítem entra desde la izquierda en cascada
  document.querySelectorAll('.contacto-item').forEach((el, i) => {
    gsap.from(el, {
      x: -60, opacity: 0, duration: 0.6, ease: 'power3.out',
      delay: i * 0.1,
      scrollTrigger: { trigger: el, start: 'top 88%', ...ST }
    })
  })

  /* ══ FORMULARIO ════════════════════════════════════════════ */

  // El card del form entra completo desde abajo
  gsap.from('.contacto-form', {
    y: 60, opacity: 0, duration: 0.75, ease: 'power3.out',
    scrollTrigger: { trigger: '.contacto-form', start: 'top 88%', ...ST }
  })

  // Campos aparecen uno a uno después del card
  document.querySelectorAll('.contacto-field').forEach((el, i) => {
    gsap.from(el, {
      x: 30, opacity: 0, duration: 0.5, ease: 'power2.out',
      delay: 0.2 + i * 0.1,
      scrollTrigger: { trigger: '.contacto-form', start: 'top 88%', ...ST }
    })
  })

  // Botón: rebote
  gsap.from('.contacto-submit', {
    scale: 0.7, opacity: 0, duration: 0.6, ease: 'back.out(1.8)',
    delay: 0.6,
    scrollTrigger: { trigger: '.contacto-form', start: 'top 88%', ...ST }
  })

  /* ══ MAPA ══════════════════════════════════════════════════ */

  gsap.from('.contacto-map', {
    opacity: 0, y: 40, duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: '.contacto-map', start: 'top 90%', ...ST }
  })

  /* ══ HOVER en inputs: micro-animación de borde ══════════════ */
  document.querySelectorAll('.contacto-field input, .contacto-field textarea').forEach(input => {
    input.addEventListener('focus', () => {
      gsap.to(input, { scale: 1.012, duration: 0.25, ease: 'power1.out' })
    })
    input.addEventListener('blur', () => {
      gsap.to(input, { scale: 1, duration: 0.25, ease: 'power1.out' })
    })
  })

  /* ══ Submit: animación de envío ═════════════════════════════ */
  const form = document.getElementById('contactoForm')
  const note = document.getElementById('contactoNote')
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const btn = form.querySelector('.contacto-submit')

      // Pulso del botón al enviar
      gsap.timeline()
        .to(btn, { scale: 0.92, duration: 0.1, ease: 'power1.in' })
        .to(btn, { scale: 1.06, duration: 0.2, ease: 'back.out(2)' })
        .to(btn, { scale: 1,    duration: 0.15, ease: 'power1.out' })

      if (note) {
        note.textContent = '¡Gracias! Te contactaremos pronto 🎸'
        note.classList.add('is-visible')
        gsap.from(note, { opacity: 0, y: 10, duration: 0.4, ease: 'power2.out' })
      }
      form.reset()
    })
  }
}
