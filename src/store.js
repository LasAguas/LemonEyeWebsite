import './styles.css'
import { Header, initMobileMenu } from './components/Header.js'
import { Footer } from './components/Footer.js'
import { resolveStore, quoteShipping, createCheckout, confirmOrder } from './lib/store-api.js'
import {
  esc, euro, findVariant, unitPrice, originalUnitPrice, isOnSale,
  amountHtml, priceHtml, shortDate, longDate,
} from './lib/store-prices.js'

const MAX_QTY = 10
const VIDEO_URL = /\.(mp4|webm|mov|m4v)(\?|#|$)/i

const state = {
  products: [],
  availability: {},
  picks: {}, // what the buyer has selected, per product id
  layout: '', // changes when products or photos change
}

document.querySelector('#app').innerHTML = `
  ${Header()}

  <main class="store-page">
    <div class="container">
      <div class="store-intro">
        <p class="store-intro__eyebrow">Lemon Eye</p>
        <h1 class="store-intro__heading heading">Store</h1>
      </div>
      <div id="store-notice" aria-live="polite"></div>
      <div id="store-root"><p class="store-status">Loading store...</p></div>
    </div>
  </main>

  ${Footer()}
`

initMobileMenu()

const root = document.getElementById('store-root')
const notice = document.getElementById('store-notice')

function showNotice(text, kind = 'info') {
  notice.innerHTML = text
    ? `<div class="store-banner store-banner--${kind}">${esc(text)}</div>`
    : ''
}

// ---------- Product and selection helpers ----------

const findProduct = id => state.products.find(p => String(p.id) === String(id))

const photosOf = product => (product.images || []).filter(url => !VIDEO_URL.test(url))

// null means unlimited stock.
function stockLeft(product, variantName) {
  const entry = state.availability[product.id]
  if (!entry) return null
  return (variantName ? entry.variants?.[variantName] : entry.remaining) ?? null
}

const isSoldOut = (product, variantName) => {
  const left = stockLeft(product, variantName)
  return left !== null && left <= 0
}

const allSoldOut = product => product.has_variants
  ? product.variants.every(v => isSoldOut(product, v.name))
  : isSoldOut(product)

function maxQty(product, variantName) {
  const left = stockLeft(product, variantName)
  return left === null ? MAX_QTY : Math.max(1, Math.min(MAX_QTY, left))
}

// The selection for a product, corrected against the latest store data.
function pickFor(product) {
  const pick = state.picks[product.id] ||= {
    variant: null, qty: 1, quote: null, quoteError: '', quoteRun: 0,
    shippingId: null, message: '', busy: false,
  }
  if (pick.variant && (!findVariant(product, pick.variant) || isSoldOut(product, pick.variant))) {
    pick.variant = null
  }
  if (!pick.variant && product.variants?.length === 1 && !allSoldOut(product)) {
    pick.variant = product.variants[0].name
  }
  pick.qty = Math.min(pick.qty, maxQty(product, pick.variant))
  return pick
}

// A complete, in-stock selection.
function isReady(product, pick) {
  if (product.has_variants) return !!pick.variant
  return !isSoldOut(product)
}

function typeOf(product, variantName) {
  const variant = findVariant(product, variantName)
  return (variant ? variant.product_type : product.product_type) || 'physical'
}

const preorderOf = (product, variantName) =>
  (variantName ? findVariant(product, variantName)?.preorder : product.preorder) || null

const needsShipping = (product, pick) =>
  isReady(product, pick) && typeOf(product, pick.variant) !== 'digital'

const itemFor = (product, pick) =>
  ({ productId: product.id, variant: pick.variant || undefined, qty: pick.qty })

// Named destinations the buyer has to choose between. A store without any
// returns a single flat price with no id.
const hasDestinations = quote => !!quote?.options?.some(o => o.id != null)

function chosenShipping(pick) {
  const options = pick.quote?.options || []
  const option = hasDestinations(pick.quote)
    ? options.find(o => o.id === pick.shippingId)
    : options[0]
  return option && option.price_cents != null ? option : null
}

// ---------- Rendering ----------

function galleryHtml(product) {
  const photos = photosOf(product)
  if (!photos.length) return ''

  const thumbs = photos.length < 2 ? '' : `
    <div class="store-gallery__thumbs">
      ${photos.map((src, i) => `
        <button type="button" class="store-thumb ${i === 0 ? 'store-thumb--active' : ''}" data-image="${i}" aria-label="View image ${i + 1}">
          <img src="${esc(src)}" alt="">
        </button>
      `).join('')}
    </div>
  `

  return `
    <div class="store-gallery">
      <div class="store-gallery__main">
        <img class="store-main-img" src="${esc(photos[0])}" alt="${esc(product.name)}">
      </div>
      ${thumbs}
    </div>
  `
}

function optionsHtml(product, pick) {
  if (!product.has_variants) return ''
  // Option prices only add information when they differ or are reduced.
  const showPrices = isOnSale(product) || product.price_min_cents !== product.price_max_cents

  return `
    <fieldset class="store-options" ${pick.busy ? 'disabled' : ''}>
      <legend class="store-quantity__label">Option</legend>
      ${product.variants.map(v => {
        const soldOut = isSoldOut(product, v.name)
        const flag = soldOut ? 'Sold out' : v.preorder ? 'Pre-order' : ''
        return `
          <label class="store-option ${pick.variant === v.name ? 'store-option--active' : ''} ${soldOut ? 'store-option--sold-out' : ''}">
            <input type="radio" name="option-${esc(product.id)}" value="${esc(v.name)}" data-key="option-${esc(v.name)}"
              ${pick.variant === v.name ? 'checked' : ''} ${soldOut ? 'disabled' : ''}>
            <span class="store-option__name">${esc(v.name)}</span>
            ${showPrices ? `<span class="store-option__price">${priceHtml(product, v.name)}</span>` : ''}
            ${flag ? `<span class="store-option__flag">${flag}</span>` : ''}
          </label>
        `
      }).join('')}
    </fieldset>
  `
}

function quantityHtml(product, pick) {
  const id = `qty-${esc(product.id)}`
  return `
    <div class="store-quantity">
      <label for="${id}" class="store-quantity__label">Quantity</label>
      <div class="store-quantity__controls">
        <button type="button" class="store-qty-btn" data-step="-1" data-key="qty-dec" aria-label="Decrease" ${pick.busy ? 'disabled' : ''}>−</button>
        <input id="${id}" type="number" value="${pick.qty}" min="1" max="${maxQty(product, pick.variant)}" class="store-qty-input" readonly>
        <button type="button" class="store-qty-btn" data-step="1" data-key="qty-inc" aria-label="Increase" ${pick.busy ? 'disabled' : ''}>+</button>
      </div>
    </div>
  `
}

function shippingPickerHtml(product, pick) {
  if (!needsShipping(product, pick) || !hasDestinations(pick.quote)) return ''
  const id = `shipping-${esc(product.id)}`
  const options = pick.quote.options

  return `
    <div class="store-shipping">
      <label for="${id}" class="store-quantity__label">Shipping to</label>
      <select id="${id}" class="store-shipping__select" data-key="shipping" ${pick.busy ? 'disabled' : ''}>
        <option value="" disabled ${chosenShipping(pick) ? '' : 'selected'}>Select shipping</option>
        ${options.map(o => {
          const unavailable = o.price_cents == null
          const cost = unavailable ? 'not available' : o.price_cents ? euro(o.price_cents) : 'Free'
          return `<option value="${esc(o.id)}" ${chosenShipping(pick)?.id === o.id ? 'selected' : ''} ${unavailable ? 'disabled' : ''}>${esc(o.label)}: ${cost}</option>`
        }).join('')}
      </select>
      ${options.filter(o => o.price_cents == null && o.message).map(o => `
        <p class="store-info__secure">${esc(o.label)}: ${esc(o.message)}</p>
      `).join('')}
    </div>
  `
}

function summaryHtml(product, pick) {
  if (!isReady(product, pick)) return ''

  const now = unitPrice(product, pick.variant) * pick.qty
  const was = originalUnitPrice(product, pick.variant) * pick.qty
  const onSale = isOnSale(product) && was > now
  // A zero percent shows the struck-through price without a second badge.
  const struck = onSale ? 0 : null

  const physical = needsShipping(product, pick)
  const shipping = physical ? chosenShipping(pick) : null
  const shippingKnown = !physical || !!shipping

  let shippingText = ''
  if (physical) {
    if (shipping) shippingText = shipping.price_cents ? euro(shipping.price_cents) : 'Free'
    else if (pick.quoteError) shippingText = 'Not available'
    else if (!pick.quote) shippingText = 'Calculating...'
    else shippingText = 'Choose a destination'
  }

  const extra = shipping?.price_cents || 0

  return `
    <dl class="store-summary">
      <div class="store-summary__row">
        <dt>${pick.qty} × ${esc(product.name)}${pick.variant ? ` (${esc(pick.variant)})` : ''}</dt>
        <dd>${amountHtml(now, was, struck)}</dd>
      </div>
      ${physical ? `
        <div class="store-summary__row">
          <dt>Shipping</dt>
          <dd>${shippingText}</dd>
        </div>
      ` : ''}
      <div class="store-summary__row store-summary__row--total">
        <dt>${shippingKnown ? 'Total' : 'Total before shipping'}</dt>
        <dd>${amountHtml(now + extra, was + extra, struck)}</dd>
      </div>
    </dl>
    ${onSale ? `<p class="store-savings">You save ${euro(was - now)}</p>` : ''}
    ${physical && pick.quoteError ? `
      <p class="store-message" role="alert">
        ${esc(pick.quoteError)}
        <button type="button" class="store-retry" data-retry data-key="retry">Try again</button>
      </p>
    ` : ''}
  `
}

function infoHtml(product) {
  const pick = pickFor(product)
  const soldOut = allSoldOut(product)
  const ready = isReady(product, pick)
  const preorder = preorderOf(product, pick.variant)
  const digital = typeOf(product, pick.variant) === 'digital'
  const canBuy = ready && !pick.busy && (!needsShipping(product, pick) || !!chosenShipping(pick))

  let label = preorder ? 'Pre-order' : 'Buy Now'
  if (pick.busy) label = 'Loading...'
  else if (soldOut) label = 'Sold out'
  else if (!ready) label = 'Choose an option'

  const endsOn = product.discount?.ends_on

  return `
    <h2 class="store-info__name heading">${esc(product.name)}</h2>
    <p class="store-info__price">${priceHtml(product, pick.variant)}</p>
    ${endsOn ? `<p class="store-sale-ends">Sale ends ${shortDate(endsOn)}</p>` : ''}
    ${product.description ? `<p class="store-info__desc">${esc(product.description)}</p>` : ''}
    ${optionsHtml(product, pick)}
    ${preorder ? `
      <p class="store-preorder">
        Pre-order: ${digital ? 'download link emailed on' : 'ships from'} ${longDate(preorder.ships_on)}
      </p>
    ` : ''}
    ${soldOut ? '' : `
      ${quantityHtml(product, pick)}
      ${shippingPickerHtml(product, pick)}
      ${summaryHtml(product, pick)}
    `}
    ${pick.message ? `<p class="store-message" role="alert">${esc(pick.message)}</p>` : ''}
    <button type="button" class="store-buy-btn" data-buy data-key="buy" ${canBuy ? '' : 'disabled'}>${label}</button>
    <p class="store-info__secure">Secure checkout via Stripe</p>
  `
}

const sectionFor = id =>
  [...root.querySelectorAll('[data-product]')].find(el => el.dataset.product === String(id))

function renderInfo(product) {
  const info = sectionFor(product.id)?.querySelector('.store-info')
  if (!info) return
  // Keep keyboard focus on the control the buyer was using.
  const key = info.contains(document.activeElement) ? document.activeElement.dataset.key : null
  info.innerHTML = infoHtml(product)
  if (key) info.querySelector(`[data-key="${CSS.escape(key)}"]`)?.focus()
}

function renderStore() {
  if (!state.products.length) {
    state.layout = ''
    root.innerHTML = '<p class="store-status">There is nothing in the store right now. Please check back soon.</p>'
    return
  }

  const layout = JSON.stringify(state.products.map(p => [p.id, p.name, photosOf(p)]))
  if (layout !== state.layout) {
    state.layout = layout
    root.innerHTML = state.products.map(p => `
      <article class="store-product ${photosOf(p).length ? '' : 'store-product--no-photos'}" data-product="${esc(p.id)}">
        ${galleryHtml(p)}
        <div class="store-info"></div>
      </article>
    `).join('')
  }
  state.products.forEach(renderInfo)
}

// ---------- Data ----------

async function refreshStore() {
  const data = await resolveStore()
  state.products = data.products || []
  state.availability = data.availability || {}
  renderStore()
}

// Shipping is priced by the server, which covers every way a store can ship.
function updateQuote(product) {
  const pick = pickFor(product)
  const run = ++pick.quoteRun
  clearTimeout(pick.quoteTimer)
  pick.quote = null
  pick.quoteError = ''
  renderInfo(product)
  if (!needsShipping(product, pick)) return

  pick.quoteTimer = setTimeout(async () => {
    let quote = null
    let error = ''
    try {
      quote = await quoteShipping([itemFor(product, pick)])
      if (!quote.options?.length) error = 'Shipping is not available for this item right now.'
    } catch (err) {
      error = err.apiMessage || 'We could not work out shipping.'
    }
    if (run !== pick.quoteRun) return // the selection changed while we waited
    pick.quote = quote
    pick.quoteError = error
    const latest = findProduct(product.id)
    if (latest) renderInfo(latest)
  }, 250)
}

const updateAllQuotes = () => state.products.forEach(updateQuote)

async function loadStore() {
  try {
    await refreshStore()
    updateAllQuotes()
  } catch (err) {
    state.layout = ''
    root.innerHTML = `<p class="store-status">${err.status === 404
      ? 'The store is not open right now. Please check back soon.'
      : 'We could not load the store. Please refresh the page to try again.'}</p>`
  }
}

// ---------- Checkout ----------

async function buy(id) {
  let product = findProduct(id)
  if (!product) return
  const pick = pickFor(product)
  if (pick.busy) return

  const seen = {
    variant: pick.variant,
    qty: pick.qty,
    unit: unitPrice(product, pick.variant),
    shipping: needsShipping(product, pick) ? chosenShipping(pick)?.price_cents : 0,
  }
  // Show the buyer what changed and let them press the button again.
  const stop = message => {
    pick.busy = false
    pick.message = message
    const latest = findProduct(id)
    if (latest) renderInfo(latest)
    else showNotice('That item is no longer available.')
  }

  showNotice('')
  pick.busy = true
  pick.message = ''
  renderInfo(product)

  try {
    // A sale or stock level can change while the page is open.
    await refreshStore()
    product = findProduct(id)
    if (!product) return stop('')

    pickFor(product)
    if (!isReady(product, pick) || pick.variant !== seen.variant || pick.qty !== seen.qty) {
      stop('Stock has changed. Please check your order and try again.')
      return updateQuote(product)
    }
    if (unitPrice(product, pick.variant) !== seen.unit) {
      stop('The price has changed. Please check the new total and try again.')
      return updateQuote(product)
    }

    const order = {
      items: [itemFor(product, pick)],
      returnUrl: `${location.origin}${location.pathname}`,
    }

    if (needsShipping(product, pick)) {
      pick.quote = await quoteShipping(order.items)
      const shipping = chosenShipping(pick)
      if (!shipping || shipping.price_cents !== seen.shipping) {
        return stop('Shipping has changed. Please check the new total and try again.')
      }
      if (shipping.id != null) order.shippingOptionId = shipping.id
    }

    const { url } = await createCheckout(order)
    if (!url) throw new Error('Checkout did not return a payment link')
    window.location.href = url
  } catch (err) {
    stop(err.apiMessage || 'Something went wrong starting checkout. Please try again.')
    // Out of stock or changed options: show the latest state.
    if (err.status === 400 || err.status === 409) {
      await refreshStore().catch(() => {})
      updateAllQuotes()
    }
  }
}

// ---------- Receipt ----------

function receiptHtml(order) {
  const items = order.items || []
  const saved = items.reduce((sum, item) => item.discount_percent
    ? sum + (item.original_unit_price_cents - item.unit_price_cents) * item.qty
    : sum, 0)

  return `
    <div class="store-receipt">
      <h2 class="store-receipt__heading heading">Thanks${order.name ? `, ${esc(order.name)}` : ''}!</h2>
      <p>Your order is confirmed. Order code: <strong>${esc(order.orderCode)}</strong></p>
      <ul class="store-receipt__items">
        ${items.map(item => `
          <li>
            <span>${Number(item.qty)} × ${esc(item.name)}${item.variant ? ` (${esc(item.variant)})` : ''}</span>
            <span class="store-receipt__price">
              ${amountHtml(item.unit_price_cents, item.original_unit_price_cents, item.discount_percent ?? null)} each
            </span>
            ${item.preorder && item.ships_on ? `<span class="store-preorder">Pre-order for ${longDate(item.ships_on)}</span>` : ''}
          </li>
        `).join('')}
      </ul>
      <dl class="store-summary">
        <div class="store-summary__row">
          <dt>Subtotal</dt>
          <dd>${euro(order.subtotalCents)}</dd>
        </div>
        ${order.shippingCents || order.shippingLabel ? `
          <div class="store-summary__row">
            <dt>Shipping${order.shippingLabel ? ` (${esc(order.shippingLabel)})` : ''}</dt>
            <dd>${order.shippingCents ? euro(order.shippingCents) : 'Free'}</dd>
          </div>
        ` : ''}
        <div class="store-summary__row store-summary__row--total">
          <dt>Total paid</dt>
          <dd>${euro(order.totalCents)}</dd>
        </div>
      </dl>
      ${saved > 0 ? `<p class="store-savings">You saved ${euro(saved)}</p>` : ''}
      <p>A receipt is on its way to ${order.email ? esc(order.email) : 'your email'}.</p>
      <p><a class="store-receipt__back" href="${esc(location.pathname)}">Back to the store</a></p>
    </div>
  `
}

async function showReceipt(sessionId) {
  root.innerHTML = '<p class="store-status">Confirming your order...</p>'
  // A refresh must not confirm the same order again.
  history.replaceState(null, '', location.pathname)
  try {
    root.innerHTML = receiptHtml(await confirmOrder(sessionId))
  } catch {
    showNotice('We could not confirm your order on this page. If you paid, your receipt will arrive by email.')
    loadStore()
  }
}

// ---------- Events ----------

root.addEventListener('click', event => {
  const section = event.target.closest('[data-product]')
  const button = event.target.closest('button')
  const product = section && findProduct(section.dataset.product)
  if (!button || !product) return
  const pick = pickFor(product)

  if (button.dataset.image) {
    section.querySelector('.store-main-img').src = photosOf(product)[Number(button.dataset.image)]
    section.querySelectorAll('.store-thumb').forEach(t =>
      t.classList.toggle('store-thumb--active', t === button))
  } else if (button.dataset.step) {
    const qty = pick.qty + Number(button.dataset.step)
    if (qty < 1 || qty > maxQty(product, pick.variant)) return
    pick.qty = qty
    pick.message = ''
    updateQuote(product)
  } else if ('retry' in button.dataset) {
    updateQuote(product)
  } else if ('buy' in button.dataset) {
    buy(product.id)
  }
})

root.addEventListener('change', event => {
  const section = event.target.closest('[data-product]')
  const product = section && findProduct(section.dataset.product)
  if (!product) return
  const pick = pickFor(product)
  pick.message = ''

  if (event.target.matches('input[type="radio"]')) {
    pick.variant = event.target.value
    updateQuote(product)
  } else if (event.target.matches('select')) {
    pick.shippingId = event.target.value
    renderInfo(product)
  }
})

// Coming back from Stripe with the browser's back button restores the old page.
window.addEventListener('pageshow', event => {
  if (!event.persisted) return
  Object.values(state.picks).forEach(pick => { pick.busy = false })
  loadStore()
})

const sessionId = new URLSearchParams(window.location.search).get('session_id')
if (sessionId) showReceipt(sessionId)
else loadStore()
