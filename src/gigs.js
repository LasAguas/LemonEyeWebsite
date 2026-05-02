import './styles.css'
import { Header, initMobileMenu } from './components/Header.js'
import { Footer } from './components/Footer.js'
import { gigs, past } from './data/gigs.js'

function formatDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const upcomingHTML = gigs.length
  ? gigs.map(g => `
      <article class="gig-card">
        <div class="gig-date" aria-label="${formatDate(g.date)}">
          <span class="gig-date__day">${g.dateLabel.day}</span>
          <span class="gig-date__month">${g.dateLabel.month}</span>
          <span class="gig-date__year">${g.dateLabel.year}</span>
        </div>
        <div class="gig-body">
          <p class="gig-role">${g.role}</p>
          <h2 class="gig-title">${g.title}</h2>
          <p class="gig-venue">
            <strong>${g.venue}</strong> · ${g.city}
          </p>
          <p class="gig-times">
            <span><span class="gig-times__label">Doors</span> ${g.doors}</span>
            <span class="gig-times__sep">·</span>
            <span><span class="gig-times__label">Show</span> ${g.show}</span>
          </p>
          ${g.description ? `<p class="gig-description">${g.description}</p>` : ''}
        </div>
        <div class="gig-cta">
          ${g.ticketUrl
            ? `<a class="gig-button" href="${g.ticketUrl}" target="_blank" rel="noopener">${g.ticketLabel || 'Tickets'} &rarr;</a>`
            : `<span class="gig-button gig-button--soon">Tickets soon</span>`
          }
        </div>
      </article>
    `).join('')
  : `
    <div class="gig-empty">
      <p>No shows on the calendar right now.</p>
      <p class="gig-empty__sub">
        Follow us on
        <a href="https://www.instagram.com/lemon.eye.zeband/" target="_blank" rel="noopener">Instagram</a>
        to be the first to know when new dates are announced.
      </p>
    </div>
  `

document.querySelector('#app').innerHTML = `
  ${Header()}

  <section class="gigs-page">
    <div class="contact-intro">
      <p class="about-eyebrow">Live · 2026</p>
      <h1 class="heading about-heading">Upcoming Gigs</h1>
      <p class="contact-lede">
        Catch us on stage. Tap a show below for tickets and details.
      </p>
    </div>

    <div class="band-divider" aria-hidden="true"></div>

    <div class="gigs-list">
      ${upcomingHTML}
    </div>

    ${past.length ? `
      <h2 class="band-heading" style="margin-top:5rem;">Past Shows</h2>
      <div class="gigs-list gigs-list--past">
        ${past.map(g => `
          <article class="gig-card gig-card--past">
            <div class="gig-date">
              <span class="gig-date__day">${g.dateLabel.day}</span>
              <span class="gig-date__month">${g.dateLabel.month}</span>
              <span class="gig-date__year">${g.dateLabel.year}</span>
            </div>
            <div class="gig-body">
              <h2 class="gig-title">${g.title}</h2>
              <p class="gig-venue"><strong>${g.venue}</strong> · ${g.city}</p>
            </div>
          </article>
        `).join('')}
      </div>
    ` : ''}
  </section>

  ${Footer()}
`

initMobileMenu()
