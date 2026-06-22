import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initNosotros } from './nosotros.js'
import { initContacto } from './contacto.js'
import { initMenuComida } from './menuComida.js'

gsap.registerPlugin(ScrollTrigger)

const VIEW_IDS = {
  home:     'view-home',
  menu:     'view-menu',
  nosotros: 'view-nosotros',
  contacto: 'view-contacto',
}

let nosotrosInitialized   = false
let contactoInitialized   = false
let menuComidaInitialized = false
let currentView = 'home'

export function initMenu() {
  const toggleBtn = document.getElementById('menuToggle')
  const overlay   = document.getElementById('menuOverlay')
  const backdrop  = document.getElementById('menuBackdrop')

  if (!toggleBtn || !overlay) return

  // Los links ahora son <a>.setlist-link dentro del setlist de papel
  const links = overlay.querySelectorAll('.setlist-link')

  const openMenu = () => {
    toggleBtn.classList.add('is-active')
    overlay.classList.add('is-open')
    backdrop?.classList.add('is-open')
    document.body.style.overflow = 'hidden'

    // Animación de entrada en los tspan
    gsap.fromTo(links,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.45, stagger: 0.07, ease: 'power3.out', delay: 0.1 }
    )
  }

  const closeMenu = () => {
    overlay.classList.remove('is-open')
    backdrop?.classList.remove('is-open')
    toggleBtn.classList.remove('is-active')
    document.body.style.overflow = ''
  }

  toggleBtn.addEventListener('click', () => {
    overlay.classList.contains('is-open') ? closeMenu() : openMenu()
  })

  backdrop?.addEventListener('click', closeMenu)

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeMenu()
  })

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const view   = link.dataset.view || 'home'
      const anchor = link.dataset.anchor

      switchView(view, anchor)
      markActiveLink(links, link)
      closeMenu()
    })
  })

  // Marcar Inicio como activo al cargar
  const homeLink = overlay.querySelector('.setlist-link[data-view="home"]')
  markActiveLink(links, homeLink)
}

function markActiveLink(links, activeLink) {
  links.forEach(l => l.classList.remove('is-active'))
  if (activeLink) activeLink.classList.add('is-active')
}

function switchView(view, anchor) {
  if (view === currentView && !anchor) return

  Object.entries(VIEW_IDS).forEach(([key, id]) => {
    const el = document.getElementById(id)
    if (!el) return
    el.classList.toggle('is-hidden', key !== view)
  })

  currentView = view
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })

  if (view === 'menu') {
    if (!menuComidaInitialized) {
      menuComidaInitialized = true
      requestAnimationFrame(() => initMenuComida())
    }
  }

  if (view === 'nosotros') {
    if (!nosotrosInitialized) {
      nosotrosInitialized = true
      requestAnimationFrame(() => { initNosotros(); ScrollTrigger.refresh() })
    } else {
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }
  }

  if (view === 'contacto') {
    if (!contactoInitialized) {
      contactoInitialized = true
      requestAnimationFrame(() => { initContacto(); ScrollTrigger.refresh() })
    } else {
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }
  }

  if (view === 'home' && anchor) {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      const target = document.getElementById(anchor)
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  } else {
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }
}
