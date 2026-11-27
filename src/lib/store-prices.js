// Price, sale and date helpers for the store page.
// The API's price_cents is always today's price (sale already taken off) and
// original_price_cents is the full price. Never work out a sale price from
// discount.percent: the server rounds per unit and that is what gets charged.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]))
}

export const euro = cents => `€${((cents || 0) / 100).toFixed(2)}`

export function findVariant(product, name) {
  return name ? (product.variants || []).find(v => v.name === name) || null : null
}

// What one unit sells for today.
export function unitPrice(product, variantName) {
  const variant = findVariant(product, variantName)
  return variant ? variant.price_cents : product.price_cents
}

// What one unit costs at full price. Falls back for data without the field.
export function originalUnitPrice(product, variantName) {
  const variant = findVariant(product, variantName)
  if (variant) return variant.original_price_cents ?? variant.price_cents
  return product.original_price_cents ?? product.price_cents
}

// The server only sends a discount while the sale is running.
export const isOnSale = product => !!product.discount

const badgeHtml = percent => `<span class="store-sale-badge">-${Number(percent)}%</span>`

// A price, plus the struck-through full price and badge when `percent` is set.
export function amountHtml(now, was, percent, prefix = '') {
  if (percent == null || !(was > now)) return prefix + euro(now)
  return `<span><span class="sr-only">Now </span>${prefix}${euro(now)}</span> ` +
    `<s class="store-was"><span class="sr-only">Was </span>${euro(was)}</s>` +
    (percent ? ` ${badgeHtml(percent)}` : '')
}

// Price of the picked option, or the headline price before one is picked.
export function priceHtml(product, variantName) {
  const percent = isOnSale(product) ? product.discount.percent : null

  if (variantName || !product.has_variants) {
    return amountHtml(unitPrice(product, variantName), originalUnitPrice(product, variantName), percent)
  }

  const now = product.price_min_cents
  const was = product.original_price_min_cents ?? now
  const prefix = product.price_min_cents !== product.price_max_cents ? 'From ' : ''
  return amountHtml(now, was, percent, prefix)
}

// "30 Nov" from "2026-11-30". Reads the string itself so no timezone can
// shift the day.
export function shortDate(ymd) {
  const [, month, day] = ymd.split('-').map(Number)
  return `${day} ${MONTHS[month - 1]}`
}

export const longDate = ymd => `${shortDate(ymd)} ${ymd.slice(0, 4)}`
