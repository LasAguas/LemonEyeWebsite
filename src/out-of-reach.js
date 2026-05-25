import './styles.css'
import './out-of-reach.css'

const platforms = [
  { label: 'Spotify',       url: 'https://open.spotify.com/album/2rCkRsHw14IPHbVmbTab5x', platform: 'spotify' },
  { label: 'Apple Music',   url: 'https://music.apple.com/gb/album/out-of-reach-single/1892339999', platform: 'apple_music' },
  { label: 'Tidal',         url: 'https://tidal.com/album/514506666/u', platform: 'tidal' },
  { label: 'YouTube Music', url: 'https://www.youtube.com/watch?v=V2_Sft3qiOU&list=RDV2_Sft3qiOU&start_radio=1', platform: 'youtube_music' },
  { label: 'Deezer',        url: 'https://link.deezer.com/s/337SaFfzcsYOXVH0OPDJ6', platform: 'deezer' },
]

document.querySelector('#app').innerHTML = `
  <main class="oor-page">
    <div class="oor-card">
      <a href="/" class="oor-artist">Lemon Eye</a>
      <img
        class="oor-cover"
        src="/images/out-of-reach-cover-art.png"
        alt="Out of Reach – Lemon Eye"
      />
      <h1 class="oor-title">Out of Reach</h1>
      <p class="oor-label">Listen now</p>
      <div class="oor-links">
        ${platforms.map(p => `
          <a class="oor-btn" href="${p.url}" target="_blank" rel="noopener"
             data-track-type="streaming"
             data-track-label="${p.label}"
             data-track-platform="${p.platform}"
             data-track-category="streaming">
            ${p.label}
          </a>
        `).join('')}
      </div>
    </div>
  </main>
`
