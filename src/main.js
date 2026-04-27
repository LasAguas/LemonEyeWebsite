import './styles.css'
import { Header, initMobileMenu } from './components/Header.js'
import { Footer } from './components/Footer.js'
import { Hero } from './components/Hero.js'
import { VideoHighlight } from './components/VideoHighlight.js'

document.querySelector('#app').innerHTML = `
  ${Header()}

  ${Hero()}

  <section class="video-section">
    ${VideoHighlight()}
  </section>

  ${Footer()}
`

initMobileMenu()
