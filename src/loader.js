import gsap from 'gsap'

const LAYERS = [
  { id: 'layer-bun-bottom', label: '🍞 Horneando el pan de abajo...' },
  { id: 'layer-patty',      label: '🥩 Asando la carne en las brasas...' },
  { id: 'layer-cheese',     label: '🧀 Derritiendo el queso americano...' },
  { id: 'layer-tomato',     label: '🍅 Cortando jitomates frescos...' },
  { id: 'layer-lettuce',    label: '🥬 Poniendo la lechuga crujiente...' },
  { id: 'layer-bun-top',    label: '🎸 ¡Coronando la obra maestra!' },
]

const NOTE_IDS = ['n1', 'n2', 'n3', 'n4', 'n5', 'n6']

/* ══════════════════════════════════════════════════════════════
   NOTAS MUSICALES — "el olor" de la hamburguesa
══════════════════════════════════════════════════════════════ */
function animateNotes() {
  NOTE_IDS.forEach((id, i) => {
    const el = document.getElementById(id)
    if (!el) return

    const side   = i % 2 === 0 ? -1 : 1
    const startX = side * (10 + i * 5)
    const drift  = side * (28 + i * 4)

    gsap.set(el, { x: startX, y: 10, opacity: 0, scale: 0.6, rotation: side * -8 })

    const noteTl = gsap.timeline({ repeat: -1, delay: i * 0.45 })

    noteTl
      .to(el, { opacity: 1, scale: 0.85, duration: 0.35, ease: 'power1.out' })
      .to(el, {
        y: -90,
        x: startX + drift * 0.5,
        rotation: side * 6,
        scale: 1,
        duration: 1.1,
        ease: 'sine.inOut'
      })
      .to(el, {
        y: -190,
        x: startX + drift,
        rotation: side * -10,
        opacity: 0,
        duration: 1.2,
        ease: 'sine.in'
      })
      .set(el, { x: startX, y: 10, scale: 0.6, rotation: side * -8 })
  })
}

// Red de seguridad: muestra el sitio y oculta el loader sin importar
// en qué estado haya quedado la animación. Nunca debe quedar nadie
// atorado mirando el loader.
function forceReveal(loaderEl, appEl) {
  if (appEl) gsap.set(appEl, { autoAlpha: 1 })
  if (loaderEl) loaderEl.style.display = 'none'
}

export function initLoader(onComplete) {
  const loaderEl   = document.getElementById('loader')
  const textEl     = document.getElementById('loaderText')
  const progressEl = document.getElementById('loaderProgress')
  const burgerEl   = document.getElementById('loaderBurger')
  const appEl      = document.getElementById('app')

  // Si falta algún elemento esperado, no nos arriesgamos a quedarnos
  // atorados: mostramos el sitio directamente y avisamos en consola.
  if (!loaderEl || !textEl || !progressEl || !burgerEl) {
    console.error('[loader] Falta un elemento del DOM esperado, se omite la animación de carga.', {
      loaderEl, textEl, progressEl, burgerEl
    })
    forceReveal(loaderEl, appEl)
    onComplete?.()
    return null
  }

  if (appEl) {
    gsap.set(appEl, { autoAlpha: 0 })
  }

  // Red de seguridad: si por cualquier razón el loader no termina en
  // un tiempo razonable (ej. un error silencioso en otro módulo),
  // se fuerza la salida en vez de dejar al usuario atorado.
  const safetyTimer = setTimeout(() => {
    console.warn('[loader] Tiempo de seguridad alcanzado, forzando salida del loader.')
    forceReveal(loaderEl, appEl)
  }, 15000)

  LAYERS.forEach(({ id }) => {
    gsap.set(`#${id}`, { y: -700, opacity: 0, scaleX: 1, scaleY: 1 })
  })

  animateNotes()

  const tl = gsap.timeline({
    onComplete: () => {
      try {
        onComplete?.()
      } catch (err) {
        console.error('[loader] El callback onComplete (hero/scroll/etc.) lanzó un error:', err)
      }

      const exitTl = gsap.timeline({
        onComplete: () => {
          clearTimeout(safetyTimer)
          loaderEl.style.display = 'none'
        }
      })

      exitTl.to(burgerEl, { scale: 1.12, duration: 0.9, ease: 'power2.out' }, 0)
      exitTl.to(loaderEl, { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, 0.15)

      if (appEl) {
        exitTl.to(appEl, { autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, 0.25)
      }
    }
  })

  tl.to({}, { duration: 0.5 })

  LAYERS.forEach(({ id, label }, i) => {
    const el       = `#${id}`
    const progress = ((i + 1) / LAYERS.length) * 100

    tl.to(el, { y: 0, opacity: 1, duration: 0.28, ease: 'power3.in' })
    tl.to(el, { scaleX: 1.20, scaleY: 0.62, duration: 0.07, ease: 'power2.out', transformOrigin: 'center center' })
    tl.to(el, { scaleX: 0.94, scaleY: 1.16, y: -20, duration: 0.13, ease: 'power2.out', transformOrigin: 'center center' })
    tl.to(el, { scaleX: 1.08, scaleY: 0.94, y: 0, duration: 0.09, ease: 'power2.in', transformOrigin: 'center center' })
    tl.to(el, { scaleX: 1, scaleY: 1, y: 0, duration: 0.10, ease: 'power1.out', transformOrigin: 'center center' })

    tl.call(() => {
      textEl.textContent     = label
      progressEl.style.width = progress + '%'
    }, null, '<-0.35')

    tl.to({}, { duration: 0.18 })
  })

  tl.to({}, { duration: 0.3 })
  tl.call(() => {
    textEl.textContent     = '🎸 ¡Rolling Burgers está listo!'
    progressEl.style.width = '100%'
    let count = 0
    const iv = setInterval(() => {
      burgerEl.style.transform = `translateX(${count % 2 === 0 ? -10 : 10}px)`
      if (++count >= 10) { clearInterval(iv); burgerEl.style.transform = '' }
    }, 50)
  })
  tl.to({}, { duration: 1.2 })

  return tl
}
