import './styles.css'
import { Header, initMobileMenu } from './components/Header.js'
import { Footer } from './components/Footer.js'
import { Hero } from './components/Hero.js'
import { Newsletter } from './components/Newsletter.js'
import { VideoHighlight } from './components/VideoHighlight.js'

document.querySelector('#app').innerHTML = `
  ${Header()}

  ${Hero()}

  <section class="two-col">
    ${Newsletter()}
    ${VideoHighlight()}
  </section>

  ${Footer()}
`

initMobileMenu()
