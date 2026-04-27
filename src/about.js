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
          Indie rock, chamber pop, hints of RnB: Berlin based <strong>Lemon Eye</strong>
          refuses to be boxed into musical clichés. Sometimes loud and flamboyant,
          other times quiet and dreamy, the group playfully jumps back and forth
          between genres, ensuring a constant flow of emotions.
        </p>
        <p>
          Founded in 2022, their instrumental constellation is also anything but
          conventional: the typical formation of drums, bass and guitars is elevated
          in some songs by the melodic sound of a cello. Lively and playful
          performances but also bittersweet and lighthearted lyrics that don't
          always take themselves too seriously &mdash; that, is Lemon Eye.
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
