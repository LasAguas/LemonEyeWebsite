const socials = [
  { name: 'Apple Music', img: 'Lemon Eye On Apple Music.png', url: '#' },
  { name: 'Bandcamp', img: 'Lemon Eye On Bandcamp.png', url: '#' },
  { name: 'Deezer', img: 'Lemon Eye On Deezer.png', url: '#' },
  { name: 'Facebook', img: 'Lemon Eye On Facebook.png', url: '#' },
  { name: 'Instagram', img: 'Lemon Eye On Instagram.png', url: 'https://www.instagram.com/lemon.eye.zeband/' },
  { name: 'SoundCloud', img: 'Lemon Eye On Soundcloud.png', url: '#' },
  { name: 'Spotify', img: 'Lemon Eye On Spotify.png', url: '#' },
  { name: 'Tidal', img: 'Lemon Eye On Tidal.png', url: '#' },
  { name: 'YouTube', img: 'Lemon Eye On YouTube.png', url: 'https://www.youtube.com/@lemon.eye.zeband' },
]

export function Footer() {
  const icons = socials.map(s => `
    <a href="${s.url}" target="_blank" rel="noopener" class="social-icon" aria-label="${s.name}">
      <img src="/images/Socials Logos Lemon Eye/${s.img}" alt="${s.name}">
    </a>
  `).join('')

  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-col">
          <a href="mailto:contact@lemoneye.band" class="footer-link">contact@lemoneye.band</a>
        </div>
        <div class="footer-col">
          <a href="/Lemon Eye EPK ENG.pdf" target="_blank" rel="noopener" class="footer-link">epk and press resources</a>
        </div>
        <div class="footer-col footer-col--icons">
          ${icons}
        </div>
      </div>
    </footer>
  `
}
