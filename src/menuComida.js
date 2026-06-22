/**
 * menuComida.js — transición cortina roja
 */

const CATS   = ['BURGERS','SIDES','BEBIDAS','POSTRES']
const TRACKS = ['TRACK 01','TRACK 02','TRACK 03','TRACK 04']
let current  = 0
let animating = false

export function initMenuComida() {
  const stage     = document.getElementById('mcStage')
  const stageWrap = document.getElementById('mcStageWrap')
  const trackName = document.getElementById('mcTrackName')
  const trackNum  = document.getElementById('mcTrackNum')
  const dotsWrap  = document.getElementById('mcDots')
  const btnPrev   = document.getElementById('mcPrev')
  const btnNext   = document.getElementById('mcNext')

  if (!stage) return

  current   = 0
  animating = false

  // Crear cortina
  let curtain = document.getElementById('mcCurtain')
  if (!curtain) {
    curtain = document.createElement('div')
    curtain.id = 'mcCurtain'
    curtain.style.cssText = `
      position: fixed;
      inset: 0;
      background: #CC0000;
      z-index: 9000;
      transform: scaleX(0);
      transform-origin: left;
      pointer-events: none;
    `
    document.body.appendChild(curtain)
  }

  // Crear dots
  dotsWrap.innerHTML = ''
  for (let i = 0; i < 4; i++) {
    const d = document.createElement('div')
    d.className = 'mc-dot' + (i === 0 ? ' active' : '')
    d.addEventListener('click', () => goTo(i, stage, trackName, trackNum, dotsWrap, btnPrev, btnNext, curtain))
    dotsWrap.appendChild(d)
  }

  stage.style.transition = 'none'
  stage.style.transform  = 'translateX(0)'
  updateUI(dotsWrap, btnPrev, btnNext)

  // Swipe touch
  let tx = 0
  stageWrap.addEventListener('touchstart', e => { tx = e.touches[0].clientX }, { passive: true })
  stageWrap.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx
    if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1, stage, trackName, trackNum, dotsWrap, btnPrev, btnNext, curtain)
  }, { passive: true })

  btnPrev.onclick = () => goTo(current - 1, stage, trackName, trackNum, dotsWrap, btnPrev, btnNext, curtain)
  btnNext.onclick = () => goTo(current + 1, stage, trackName, trackNum, dotsWrap, btnPrev, btnNext, curtain)

  // Animar primera página al cargar
  setTimeout(() => animatePageIn(stage.querySelectorAll('.mc-page')[0]), 300)
}

function goTo(idx, stage, trackName, trackNum, dotsWrap, btnPrev, btnNext, curtain) {
  if (animating || idx === current || idx < 0 || idx > 3) return
  animating = true
  const dir = idx > current ? 'left' : 'right'
  current = idx

  // FASE 1 — cortina entra desde la dirección del movimiento
  curtain.style.transition = 'transform 0.22s ease-in'
  curtain.style.transformOrigin = dir === 'left' ? 'left' : 'right'
  curtain.style.transform = 'scaleX(1)'

  // FASE 2 — al 50%: mover el stage y actualizar UI (oculto bajo la cortina)
  setTimeout(() => {
    stage.style.transition = 'none'
    stage.style.transform  = `translateX(-${current * 25}%)`
    trackName.textContent  = CATS[current]
    trackNum.textContent   = TRACKS[current]
    updateUI(dotsWrap, btnPrev, btnNext)

    // FASE 3 — cortina sale por el lado opuesto
    curtain.style.transition = 'transform 0.22s ease-out'
    curtain.style.transformOrigin = dir === 'left' ? 'right' : 'left'
    curtain.style.transform = 'scaleX(0)'
  }, 220)

  // FIN
  setTimeout(() => { animating = false }, 460)
}

function updateUI(dotsWrap, btnPrev, btnNext) {
  dotsWrap.querySelectorAll('.mc-dot').forEach((d, i) => d.classList.toggle('active', i === current))
  btnPrev.disabled = current === 0
  btnNext.disabled = current === 3
}

function animatePageIn(pageEl) {
  if (!pageEl) return
  const items = pageEl.querySelectorAll('.mc-item')
  items.forEach((el, i) => {
    el.style.opacity    = '0'
    el.style.transform  = 'translateY(20px)'
    el.style.transition = `opacity 0.35s ease ${50 + i * 55}ms, transform 0.35s ease ${50 + i * 55}ms`
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.opacity   = '1'
      el.style.transform = 'translateY(0)'
    }))
  })
}
