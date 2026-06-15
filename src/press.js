import './styles.css'
import { Header, initMobileMenu } from './components/Header.js'
import { Footer, socials } from './components/Footer.js'
import { gigs } from './data/gigs.js'

function formatDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const pressPhotos = [
  { src: '/images/band-profiles/Aicha PFP.JPG', alt: 'Aicha (vocals) performing live', credit: 'Krasi Paskalev' },
  { src: '/images/band-profiles/Ada PFP.JPG', alt: 'Ada (guitar) performing live', credit: 'Krasi Paskalev' },
  { src: '/images/band-profiles/Julienne PFP.jpeg', alt: 'Julien (bass) performing live', credit: 'Krasi Paskalev' },
  { src: '/images/band-profiles/AC PFP.JPG', alt: 'Anne Claire (cello) performing live', credit: 'Krasi Paskalev' },
  { src: '/images/band-profiles/Jakob PFP.jpeg', alt: 'Jakob (drums) performing live', credit: 'Krasi Paskalev' },
]

const pressCoverage = [
  {
    source: 'indie.berlin',
    title: 'Live review of Lemon Eye',
    url: 'https://www.indie.berlin/review-lemon-eye/',
  },
]

const showsPlayed = [
  { venue: 'Barket', role: 'Open mic opener' },
  { venue: 'Bar Bobu' },
  { venue: 'Weisse Rose' },
  { venue: 'Artstalker' },
  { venue: 'Sound der Nacht', role: 'Opener for the circus' },
  { venue: 'Sky Mic Berlin' },
  { venue: 'Breaking Sound Berlin' },
  { venue: 'Pfefferberg Haus 13', role: 'Opener for Sector 5' },
  { venue: 'House of Music', role: 'Opening for Oktobernacht' },
  { venue: 'Lark', role: 'Opening for Efro' },
  { venue: 'Yorck Kino Opening Night', role: 'Acoustic' },
  { venue: 'Bandlift Festival' },
  { venue: 'Kraut & Rüben Festival' },
]

const contacts = [
  {
    label: 'General Inquiries',
    note: 'Press, collaborations, and everything else.',
    email: 'contact@lemoneye.band',
  },
  {
    label: 'Marketing',
    note: 'Interviews, videos, and other promotional materials.',
    email: 'contact@lasaguasproductions.com',
  },
]

function gigCardHTML(g) {
  return `
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
  `
}

const upcomingHTML = gigs.length
  ? gigs.map(gigCardHTML).join('')
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

  <section class="press-page">
    <div class="about-intro">
      <p class="about-eyebrow">Press &amp; Media</p>
      <h1 class="heading about-heading">Press</h1>
      <div class="about-bio">
        <p>
          Indie rock, chamber pop, hints of RnB: Berlin based <strong>Lemon Eye</strong>
          refuses to be boxed into musical clichés. Sometimes loud and flamboyant,
          other times quiet and dreamy, the group playfully jumps back and forth
          between genres, ensuring a constant flow of emotions.
        </p>
        <p>
          Founded in 2022, their instrumental makeup is also anything but
          conventional: the typical formation of drums, bass and guitars is
          elevated in some songs by the melodic sound of a cello. Lively and
          playful performances but also bittersweet and lighthearted lyrics
          that don't always take themselves too seriously &mdash; that, is Lemon Eye.
        </p>
      </div>
      <div class="press-actions">
        <a class="gig-button" href="/Lemon Eye EPK ENG.pdf" target="_blank" rel="noopener">Download EPK &rarr;</a>
      </div>
    </div>

    <div class="band-divider" aria-hidden="true"></div>

    <h2 class="band-heading">Live</h2>
    <div class="press-video">
      <div class="video-wrap">
        <!-- Drop in a YouTube embed iframe here, e.g.
             <iframe src="https://www.youtube.com/embed/VIDEO_ID" ... ></iframe> -->
        <div class="placeholder" data-label="Live video — embed coming soon"></div>
      </div>
    </div>

    <h2 class="band-heading">Photos</h2>
    <div class="press-gallery">
      ${pressPhotos.map(p => `
        <figure class="press-photo">
          <div class="press-photo__frame">
            <img src="${p.src}" alt="${p.alt}" loading="lazy" />
          </div>
          <figcaption class="press-photo__credit">Photo: ${p.credit}</figcaption>
        </figure>
      `).join('')}
    </div>

    <h2 class="band-heading">In the Press</h2>
    <div class="press-coverage-list">
      ${pressCoverage.map(c => `
        <a class="press-coverage-item" href="${c.url}" target="_blank" rel="noopener">
          <div class="press-coverage-item__main">
            <span class="press-coverage-item__source">${c.source}</span>
            <span class="press-coverage-item__desc">${c.title}</span>
          </div>
          <span class="press-coverage-item__cta">Read &rarr;</span>
        </a>
      `).join('')}
    </div>

    <h2 class="band-heading">Upcoming Shows</h2>
    <div class="gigs-list">
      ${upcomingHTML}
    </div>

    <h2 class="band-heading">Shows Played</h2>
    <div class="press-shows-grid">
      ${showsPlayed.map(s => `
        <div class="press-show-item">
          <span class="press-show-item__venue">${s.venue}</span>
          ${s.role ? `<span class="press-show-item__role">${s.role}</span>` : ''}
        </div>
      `).join('')}
    </div>

    <div class="band-divider" aria-hidden="true"></div>

    <h2 class="band-heading">Listen &amp; Follow</h2>
    <div class="press-socials">
      ${socials.map(s => `
        <a href="${s.url}" target="_blank" rel="noopener" class="social-icon social-icon--lg" aria-label="${s.name}">
          <img src="/images/Socials Logos Lemon Eye/${s.img}" alt="${s.name}">
        </a>
      `).join('')}
    </div>

    <h2 class="band-heading">Get in Touch</h2>
    <div class="contact-grid contact-grid--press">
      ${contacts.map(c => `
        <article class="contact-card">
          <p class="contact-card__label">${c.label}</p>
          <p class="contact-card__note">${c.note}</p>
          <a class="contact-card__link" href="mailto:${c.email}">${c.email}</a>
        </article>
      `).join('')}
    </div>
  </section>

  ${Footer()}
`

initMobileMenu()
