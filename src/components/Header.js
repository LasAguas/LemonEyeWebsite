export function Header() {
  return `
    <header class="site-header">
      <div class="container">
        <a href="/" class="nav-home">Home</a>
        <nav class="nav-right">
          <a href="/about.html">About</a>
          <span class="nav-sep">|</span>
          <a href="mailto:contact@lemoneye.band">Contact</a>
          <span class="nav-sep">|</span>
          <a href="https://www.instagram.com/lemoneyeband/" target="_blank" rel="noopener">Instagram</a>
          <span class="nav-sep">|</span>
          <a href="https://www.youtube.com/@LemonEyeBand" target="_blank" rel="noopener">YouTube</a>
        </nav>
        <button class="mobile-menu-btn" aria-label="Menu">&#9776;</button>
      </div>
    </header>

    <nav class="mobile-menu">
      <a href="/about.html">About</a>
      <a href="mailto:contact@lemoneye.band">Contact</a>
      <a href="https://www.instagram.com/lemoneyeband/" target="_blank" rel="noopener">Instagram</a>
      <a href="https://www.youtube.com/@LemonEyeBand" target="_blank" rel="noopener">YouTube</a>
    </nav>
  `
}

export function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn')
  const mobileMenu = document.querySelector('.mobile-menu')

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open')
    })
  }
}
