import './styles.css'
import { Header, initMobileMenu } from './components/Header.js'
import { Footer } from './components/Footer.js'
import { Hero, hasShow } from './components/Hero.js'
import { NewsletterForm } from './components/NewsletterForm.js'
import { VideoHighlight } from './components/VideoHighlight.js'

document.querySelector('#app').innerHTML = `
  ${Header()}

  ${Hero()}

  ${hasShow ? `
  <section class="newsletter-section">
    ${NewsletterForm({ wrapperClass: 'newsletter-section__form' })}
  </section>
  ` : ''}

  <section class="video-section">
    ${VideoHighlight()}
  </section>

  ${Footer()}
`

initMobileMenu()
