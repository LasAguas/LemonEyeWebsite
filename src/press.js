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
  { src: '/images/press/Band Horizontal L.png', alt: 'Lemon Eye band photo', credit: 'Krasi Paskalev' },
  { src: '/images/press/Full Band Fun.png', alt: 'Lemon Eye full band', credit: 'Krasi Paskalev' },
  { src: '/images/press/Band with Instruments.png', alt: 'Lemon Eye with instruments', credit: 'Krasi Paskalev' },
  { src: '/images/press/Band Vertical Image.png', alt: 'Lemon Eye band portrait', credit: 'Krasi Paskalev' },
  { src: '/images/press/Full Band White BG.png', alt: 'Lemon Eye full band on white background', credit: 'Krasi Paskalev' },
  { src: '/images/press/Aicha - Vocals for Lemon Eye.png', alt: 'Aicha (vocals) - Lemon Eye', credit: 'Krasi Paskalev' },
  { src: '/images/press/Ada - Guitarist for Lemon Eye.png', alt: 'Ada (guitar) - Lemon Eye', credit: 'Krasi Paskalev' },
  { src: '/images/press/Julien - Bassist for Lemon Eye.png', alt: 'Julien (bass) - Lemon Eye', credit: 'Krasi Paskalev' },
  { src: '/images/press/AC - Cellist for Lemon Eye.png', alt: 'Anne Claire (cello) - Lemon Eye', credit: 'Krasi Paskalev' },
  { src: '/images/press/Jakob - Drummer for Lemon Eye.png', alt: 'Jakob (drums) - Lemon Eye', credit: 'Krasi Paskalev' },
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
  {
    category: 'Headlining',
    shows: [
      { venue: 'Bar Bobu' },
      { venue: 'Weisse Rose' },
      { venue: 'Artstalker' },
      { venue: 'Sky Mic Berlin' },
      { venue: 'Breaking Sound Berlin' },
      { venue: 'Yorck Kino Opening Night', role: 'Acoustic' },
    ],
  },
  {
    category: 'Festivals',
    shows: [
      { venue: 'Bandlift Festival' },
      { venue: 'Kraut & Rüben Festival' },
    ],
  },
  {
    category: 'Opening',
    shows: [
      { venue: 'Barket', role: 'Open mic opener' },
      { venue: 'Sound der Nacht', role: 'Opener for the circus' },
      { venue: 'Pfefferberg Haus 13', role: 'Opener for Sector 5' },
      { venue: 'House of Music', role: 'Opening for Oktobernacht' },
      { venue: 'Lark', role: 'Opening for Efro' },
    ],
  },
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
          Lemon Eye is a band of contrasts - sometimes loud and flamboyant, other times quiet and dreamy. Hailing from Berlin, this five-piece group seamlessly blends infectious pop melodies, heavy rock energy, and laid-back indie vibes, effortlessly crossing genre boundaries. Their lyrics strike a balance between lighthearted and bittersweet, creating songs that feel both familiar and unexpected. 
</p><p>
Adding to their unique sonic identity, Lemon Eye’s lineup isn’t your typical (indie-)rock ensemble. Alongside the powerful combination of drums, bass, and guitars, the band features a cello, infusing their music with an extra layer of depth and emotion.
</p><p>
But it’s not just their music that stands out - Lemon Eye’s live performances are an experience in themselves: With an electrifying stage presence, the band brings high-energy fun to every show, led by their quirky and captivating frontwoman Aicha. Whether it’s playful banter, unexpected moments, or pure musical passion, their concerts are anything but ordinary. 
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
        <iframe
          src="https://www.youtube.com/embed/qQNY8fiCLjg"
          title="Lemon Eye — Live"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
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
    ${showsPlayed.map(group => `
      <h3 class="press-shows-category">${group.category}</h3>
      <div class="press-shows-grid">
        ${group.shows.map(s => `
          <div class="press-show-item">
            <span class="press-show-item__venue">${s.venue}</span>
            ${s.role ? `<span class="press-show-item__role">${s.role}</span>` : ''}
          </div>
        `).join('')}
      </div>
    `).join('')}
<br>
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
