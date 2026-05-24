const socials = [
  { name: 'Apple Music', img: 'Lemon Eye On Apple Music.png', url: 'https://music.apple.com/gb/artist/lemon-eye/1663690008' },
  { name: 'Bandcamp', img: 'Lemon Eye On Bandcamp.png', url: 'https://lemoneye.bandcamp.com/' },
  { name: 'Deezer', img: 'Lemon Eye On Deezer.png', url: 'https://www.deezer.com/de/artist/196463387' },
  { name: 'Facebook', img: 'Lemon Eye On Facebook.png', url: 'https://www.facebook.com/profile.php?id=61556828711254' },
  { name: 'Instagram', img: 'Lemon Eye On Instagram.png', url: 'https://www.instagram.com/lemon.eye.zeband/' },
  { name: 'SoundCloud', img: 'Lemon Eye On Soundcloud.png', url: 'https://soundcloud.com/lemon-eye' },
  { name: 'Spotify', img: 'Lemon Eye On Spotify.png', url: 'https://open.spotify.com/artist/0TWRk3ga3JAtCHFyGZFWiT' },
  { name: 'Tidal', img: 'Lemon Eye On Tidal.png', url: 'https://tidal.com/artist/46840785' },
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
