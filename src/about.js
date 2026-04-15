import './styles.css'
import { Header, initMobileMenu } from './components/Header.js'
import { Footer } from './components/Footer.js'

document.querySelector('#app').innerHTML = `
  ${Header()}

  <section class="about-page">
    <h1 class="heading">About</h1>
    <div class="about-content">
      <div class="placeholder" data-label="About Content - Add band bio, photos, etc."></div>
    </div>
  </section>

  ${Footer()}
`

initMobileMenu()
