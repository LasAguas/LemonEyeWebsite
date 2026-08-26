import './styles.css'
import { Header, initMobileMenu } from './components/Header.js'
import { Footer } from './components/Footer.js'
import { Hero, hasShow } from './components/Hero.js'
import { NewsletterForm, initNewsletterForm } from './components/NewsletterForm.js'
import { VideoHighlight } from './components/VideoHighlight.js'
import { SITE_FORM } from './lib/signup-config.js'

document.querySelector('#app').innerHTML = `
  ${Header()}

  ${Hero()}

  ${hasShow ? `
  <section class="newsletter-section">
    ${NewsletterForm({ wrapperClass: 'newsletter-section__form', slug: SITE_FORM.slug, formId: SITE_FORM.formId })}
  </section>
  ` : ''}

  <section class="video-section">
    ${VideoHighlight()}
  </section>

  ${Footer()}
`

initMobileMenu()
initNewsletterForm()
