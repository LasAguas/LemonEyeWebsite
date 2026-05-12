import './styles.css'
import { Header, initMobileMenu } from './components/Header.js'
import { Footer } from './components/Footer.js'

const gigs = []

const outOfReachPlatforms = [
  { label: 'Apple Music', url: 'https://music.apple.com/gb/album/out-of-reach-single/1892339999' },
  { label: 'Tidal', url: 'https://tidal.com/album/514506666/u' },
  { label: 'YouTube Music', url: 'https://www.youtube.com/watch?v=V2_Sft3qiOU&list=RDV2_Sft3qiOU&start_radio=1' },
  { label: 'Deezer', url: 'https://link.deezer.com/s/337SaFfzcsYOXVH0OPDJ6' },
  { label: 'Spotify', url: 'https://open.spotify.com/album/2rCkRsHw14IPHbVmbTab5x' },
]

const links = [
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
` : ''

const outOfReachHTML = `
  <div class="listen-expand" data-expanded="false">
    <button type="button" class="gig-button listen-expand__toggle" aria-expanded="false" aria-controls="oor-platforms">
      Listen to "Out of Reach" <span class="listen-expand__chev" aria-hidden="true">&darr;</span>
    </button>
    <div id="oor-platforms" class="listen-expand__panel" hidden>
      ${outOfReachPlatforms.map(p => `
        <a class="gig-button gig-button--platform" href="${p.url}" target="_blank" rel="noopener">
          ${p.label} &rarr;
        </a>
      `).join('')}
    </div>
  </div>
`

const linksHTML = links.map(l => `
  <a class="gig-button" href="${l.url}" target="_blank" rel="noopener">
    ${l.label} &rarr;
  </a>
`).join('')

document.querySelector('#app').innerHTML = `
  ${Header()}

  <section class="gigs-page" style="min-height:calc(100vh - 8rem); display:flex; align-items:center; justify-content:center; padding-top:5rem;">
    ${gigHTML ? `<div class="gigs-list">${gigHTML}</div>` : ''}
    <div class="socials-links" style="display:flex; flex-direction:column; gap:1.25rem;">
      ${outOfReachHTML}
      ${linksHTML}
    </div>
  </section>

  ${Footer()}
`

initMobileMenu()

const expand = document.querySelector('.listen-expand')
if (expand) {
  const toggle = expand.querySelector('.listen-expand__toggle')
  const panel = expand.querySelector('.listen-expand__panel')
  toggle.addEventListener('click', () => {
    const open = expand.dataset.expanded === 'true'
    expand.dataset.expanded = open ? 'false' : 'true'
    toggle.setAttribute('aria-expanded', open ? 'false' : 'true')
    panel.hidden = open
  })
}
