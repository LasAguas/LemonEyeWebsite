export function Header() {
  return `
    <header class="site-header">
      <div class="container">
        <a href="/" class="nav-home"><img src="/images/Lemon-Eye-Logo.png" alt="Lemon Eye" class="nav-logo" /></a>
        <nav class="nav-right">
          <a href="/about">About</a>
          <span class="nav-sep">|</span>
          <a href="/gigs">Gigs</a>
          <span class="nav-sep">|</span>
          <!-- <a href="/press">Press</a>
          <span class="nav-sep">|</span>
          <a href="/store">Store</a> 
          <span class="nav-sep">|</span>-->
          <a href="/press">Press</a>
          <span class="nav-sep">|</span>
          <a href="/contact">Contact</a>
        </nav>
        <button class="mobile-menu-btn" aria-label="Menu">&#9776;</button>
      </div>
      <nav class="mobile-menu">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/gigs">Gigs</a>
        <!--<a href="/press">Press</a>
        <a href="/store">Store</a>-->
        <a href="/press">Press</a>
        <a href="/contact">Contact</a>
      </nav>
    </header>
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
