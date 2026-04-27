import './styles.css'
import { Header, initMobileMenu } from './components/Header.js'
import { Footer } from './components/Footer.js'

const gigs = [
  {
    date: '2026-05-04',
    dateLabel: { day: '04', month: 'May', year: '2026' },
    title: 'Efro — EP Release Show',
    role: 'Supporting Efro · with LJIA',
    venue: 'Lark Berlin',
    city: 'Berlin, DE',
    doors: '19:00',
    show: '19:30',
    description:
      'Release show for Efro\'s new EP "Year of Yearning". Lemon Eye opens the night with a short set alongside LJIA before Efro\'s headline.',
    ticketUrl: 'https://lasaguasproductions.com/events/efro-at-lark',
    ticketLabel: 'Get Tickets',
  },
]

const links = [
  {
    label: 'Presave "Out of Reach"',
    url: 'https://distrokid.com/hyperfollow/lemoneye/out-of-reach?ref=release',
  },
  {
    label: 'Mailing list',
    url: 'http://eepurl.com/jomA7I',
  },
  {
    label: 'Listen to "Honey"',
    url: 'https://distrokid.com/hyperfollow/lemoneye/honey?utm_campaign=website&utm_medium=Email+&utm_source=SendGrid',
  },
]

function formatDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const nextGig = gigs[0]

const gigHTML = nextGig ? `
  <article class="gig-card">
    <div class="gig-date" aria-label="${formatDate(nextGig.date)}">
      <span class="gig-date__day">${nextGig.dateLabel.day}</span>
      <span class="gig-date__month">${nextGig.dateLabel.month}</span>
      <span class="gig-date__year">${nextGig.dateLabel.year}</span>
    </div>
    <div class="gig-body">
      <p class="gig-role">${nextGig.role}</p>
      <h2 class="gig-title">${nextGig.title}</h2>
      <p class="gig-venue">
        <strong>${nextGig.venue}</strong> · ${nextGig.city}
      </p>
      <p class="gig-times">
        <span><span class="gig-times__label">Doors</span> ${nextGig.doors}</span>
        <span class="gig-times__sep">·</span>
        <span><span class="gig-times__label">Show</span> ${nextGig.show}</span>
      </p>
      ${nextGig.description ? `<p class="gig-description">${nextGig.description}</p>` : ''}
    </div>
    <div class="gig-cta">
      ${nextGig.ticketUrl
        ? `<a class="gig-button" href="${nextGig.ticketUrl}" target="_blank" rel="noopener">${nextGig.ticketLabel || 'Tickets'} &rarr;</a>`
        : `<span class="gig-button gig-button--soon">Tickets soon</span>`
      }
    </div>
  </article>
` : `
  <div class="gig-empty">
    <p>No shows on the calendar right now.</p>
  </div>
`

const linksHTML = links.map(l => `
  <a class="gig-button" href="${l.url}" target="_blank" rel="noopener">
    ${l.label} &rarr;
  </a>
`).join('')

document.querySelector('#app').innerHTML = `
  ${Header()}

  <section class="gigs-page" style="padding-top:5rem;">
    <div class="gigs-list">
      ${gigHTML}
    </div>

    <div class="socials-links" style="display:flex; flex-direction:column; gap:1.25rem; margin-top:4rem;">
      ${linksHTML}
    </div>
  </section>

  ${Footer()}
`

initMobileMenu()
