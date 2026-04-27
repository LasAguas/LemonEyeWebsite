import './styles.css'
import { Header, initMobileMenu } from './components/Header.js'
import { Footer } from './components/Footer.js'

const contacts = [
  {
    label: 'General Inquiries',
    note: 'Press, collaborations, and everything else.',
    email: 'contact@lemoneye.band',
  },
  {
    label: 'Bookings',
    note: 'Live shows, festivals, and tour dates.',
    email: 'contact@lemoneye.band',
  },
  {
    label: 'Press & EPK',
    note: 'High-res photos, bio, and press materials.',
    href: '/Lemon Eye EPK ENG.pdf',
    cta: 'Open press kit',
  },
]

const elsewhere = [
  { label: 'Instagram', url: 'https://www.instagram.com/lemon.eye.zeband/' },
  { label: 'YouTube', url: 'https://www.youtube.com/@lemon.eye.zeband' },
]

document.querySelector('#app').innerHTML = `
  ${Header()}

  <section class="contact-page">
    <div class="contact-intro">
      <p class="about-eyebrow">Get in touch</p>
      <h1 class="heading about-heading">Contact</h1>
      <p class="contact-lede">
        Whether you're booking a show, writing a story, or just want to say hi,
        we'd love to hear from you. Pick the right line below and we'll get back
        to you as soon as we can.
      </p>
    </div>

    <div class="band-divider" aria-hidden="true"></div>

    <div class="contact-grid">
      ${contacts.map(c => `
        <article class="contact-card">
          <p class="contact-card__label">${c.label}</p>
          <p class="contact-card__note">${c.note}</p>
          ${c.email
            ? `<a class="contact-card__link" href="mailto:${c.email}">${c.email}</a>`
            : `<a class="contact-card__link" href="${c.href}">${c.cta} &rarr;</a>`
          }
        </article>
      `).join('')}
    </div>

    <div class="contact-elsewhere">
      <p class="about-eyebrow">Find us elsewhere</p>
      <ul class="contact-elsewhere__list">
        ${elsewhere.map(e => `
          <li>
            <a href="${e.url}" target="_blank" rel="noopener">${e.label} &rarr;</a>
          </li>
        `).join('')}
      </ul>
    </div>
  </section>

  ${Footer()}
`

initMobileMenu()
