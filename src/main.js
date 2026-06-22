import './style.css'
import './hero.css'
import './menu.css'
import './nosotros.css'
import './contacto.css'
import './menuComida.css'
import { initLoader } from './loader.js'
import { initHero, initBubbles, initDividerWaves, initScrollAnimations } from './hero.js'
import { initMenu } from './menu.js'

// El menú se activa de inmediato (no depende del loader)
initMenu()

initLoader(() => {
  initHero()
  initBubbles()
  initDividerWaves()
  initScrollAnimations()
})
