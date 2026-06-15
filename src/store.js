import './styles.css'
import { Header, initMobileMenu } from './components/Header.js'
import { Footer } from './components/Footer.js'

const PRODUCT = {
  id: 'cassette',
  name: 'Out of Reach',
  subtitle: 'Cassette Tape',
  price: '£12',
  description: 'Limited edition cassette. Hand-numbered. Includes a digital download code.',
  images: [
    '/images/Product-Image-Cassette-0.jpg',
    '/images/Product-Image-Cassette-1.jpg',
  ],
}

function StoreProduct(product) {
  const thumbs = product.images.map((src, i) => `
    <button class="store-thumb ${i === 0 ? 'store-thumb--active' : ''}" data-index="${i}" aria-label="View image ${i + 1}">
      <img src="${src}" alt="${product.name} — view ${i + 1}">
    </button>
  `).join('')

  return `
    <div class="store-product">
      <div class="store-gallery">
        <div class="store-gallery__main">
          <img
            id="store-main-img"
            src="${product.images[0]}"
            alt="${product.name} cassette tape"
          >
        </div>
        <div class="store-gallery__thumbs">
          ${thumbs}
        </div>
      </div>

      <div class="store-info">
        <p class="store-info__eyebrow">Limited Edition</p>
        <h1 class="store-info__name heading">${product.name}</h1>
        <p class="store-info__subtitle">${product.subtitle}</p>
        <p class="store-info__price">${product.price}</p>
        <p class="store-info__desc">${product.description}</p>

        <div class="store-quantity">
          <label for="store-qty" class="store-quantity__label">Quantity</label>
          <div class="store-quantity__controls">
            <button class="store-qty-btn" id="store-qty-dec" aria-label="Decrease">−</button>
            <input
              id="store-qty"
              type="number"
              value="1"
              min="1"
              max="10"
              class="store-qty-input"
              readonly
            >
            <button class="store-qty-btn" id="store-qty-inc" aria-label="Increase">+</button>
          </div>
        </div>

        <button class="store-buy-btn" id="store-buy-btn" data-product="${product.id}">
          Buy Now
        </button>
        <p class="store-info__secure">Secure checkout via Stripe</p>
      </div>
    </div>
  `
}

function BannerMessage() {
  const params = new URLSearchParams(window.location.search)
  if (params.get('success') === 'true') {
    return `
      <div class="store-banner store-banner--success" role="alert">
        Order confirmed — thank you! Check your email for your receipt and download code.
      </div>
    `
  }
  if (params.get('cancelled') === 'true') {
    return `
      <div class="store-banner store-banner--info" role="alert">
        Your order was cancelled. No charge was made.
      </div>
    `
  }
  return ''
}

document.querySelector('#app').innerHTML = `
  ${Header()}

  <main class="store-page">
    <div class="container">
      <div class="store-intro">
        <p class="store-intro__eyebrow">Lemon Eye</p>
        <h1 class="store-intro__heading heading">Store</h1>
      </div>
      ${BannerMessage()}
      ${StoreProduct(PRODUCT)}
    </div>
  </main>

  ${Footer()}
`

initMobileMenu()

// Image gallery
const mainImg = document.getElementById('store-main-img')
document.querySelectorAll('.store-thumb').forEach(btn => {
  btn.addEventListener('click', () => {
    const idx = parseInt(btn.dataset.index)
    mainImg.src = PRODUCT.images[idx]
    document.querySelectorAll('.store-thumb').forEach(t => t.classList.remove('store-thumb--active'))
    btn.classList.add('store-thumb--active')
  })
})

// Quantity controls
const qtyInput = document.getElementById('store-qty')
document.getElementById('store-qty-dec').addEventListener('click', () => {
  const v = parseInt(qtyInput.value)
  if (v > 1) qtyInput.value = v - 1
})
document.getElementById('store-qty-inc').addEventListener('click', () => {
  const v = parseInt(qtyInput.value)
  if (v < 10) qtyInput.value = v + 1
})

// Checkout
document.getElementById('store-buy-btn').addEventListener('click', async () => {
  const btn = document.getElementById('store-buy-btn')
  const qty = parseInt(qtyInput.value)

  btn.disabled = true
  btn.textContent = 'Loading...'

  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: PRODUCT.id, quantity: qty }),
    })

    const data = await res.json()

    if (!res.ok || !data.url) {
      throw new Error(data.error || 'Unexpected error')
    }

    window.location.href = data.url
  } catch (err) {
    alert('Something went wrong starting checkout. Please try again.')
    btn.disabled = false
    btn.textContent = 'Buy Now'
  }
})
