import './styles.css'
import { Header, initMobileMenu } from './components/Header.js'
import { Footer } from './components/Footer.js'

const members = [
  { name: 'Aicha', role: 'Lead Vocals', img: '/images/band-profiles/Aicha PFP.JPG' },
  { name: 'Ada', role: 'Guitar', img: '/images/band-profiles/Ada PFP.JPG' },
  { name: 'Julien', role: 'Bass', img: '/images/band-profiles/Julienne PFP.jpeg' },
  { name: 'Anne Claire', role: 'Cello, Backing Vocals', img: '/images/band-profiles/AC PFP.JPG' },
  { name: 'Jakob', role: 'Drums', img: '/images/band-profiles/Jakob PFP.jpeg' },
]

document.querySelector('#app').innerHTML = `
  ${Header()}

  <section class="about-page">
    <div class="about-intro">
      <p class="about-eyebrow">Berlin · Indie Rock · Chamber Pop</p>
      <h1 class="heading about-heading">About the Band</h1>
      <div class="about-bio">
        <p>
          Sometimes loud and cheeky, sometimes vulnerable and dreamy: <strong>Lemon Eye</strong> blends
          pop, indie, and rock into a sound full of contrasts, seamlessly shifting between moods
          and emotions. Featuring a lineup that includes not only drums, bass, and guitars but
          also a cello, the band introduces a refreshing element to their music, delivering live
          performances that linger in your mind.
        </p>
      </div>
    </div>

    <div class="band-divider" aria-hidden="true"></div>

    <h2 class="band-heading">Meet the Band</h2>
    <div class="band-grid">
      ${members.map(m => `
        <figure class="band-member">
          <div class="band-member__photo">
            <img src="${m.img}" alt="${m.name} &mdash; ${m.role}" loading="lazy" />
          </div>
          <figcaption class="band-member__caption">
            <span class="band-member__name">${m.name}</span>
            <span class="band-member__role">${m.role}</span>
          </figcaption>
        </figure>
      `).join('')}
    </div>
  </section>

  ${Footer()}
`

initMobileMenu()
