export function Header() {
  return `
    <header class="site-header">
      <div class="container">
        <a href="/" class="nav-home">Home</a>
        <nav class="nav-right">
          <a href="/about">About</a>
          <span class="nav-sep">|</span>
          <a href="/gigs">Gigs</a>
          <span class="nav-sep">|</span>
          <a href="/contact">Contact</a>
          <span class="nav-sep">|</span>
          <a href="https://www.instagram.com/lemon.eye.zeband/" target="_blank" rel="noopener">Instagram</a>
          <span class="nav-sep">|</span>
          <a href="https://www.youtube.com/@lemon.eye.zeband" target="_blank" rel="noopener">YouTube</a>
        </nav>
        <button class="mobile-menu-btn" aria-label="Menu">&#9776;</button>
      </div>
    </header>

    <nav class="mobile-menu">
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/gigs">Gigs</a>
      <a href="/contact">Contact</a>
      <a href="https://www.instagram.com/lemon.eye.zeband/" target="_blank" rel="noopener">Instagram</a>
      <a href="https://www.youtube.com/@lemon.eye.zeband" target="_blank" rel="noopener">YouTube</a>
    </nav>
  `
}

export function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn')
  const mobileMenu = document.querySelector('.mobile-menu')
  const navHome = document.querySelector('.nav-home')

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open')
      if (navHome) navHome.style.visibility = isOpen ? 'hidden' : 'visible'
    })
  }
}
