// Las Aguas public webstore API, used by src/store.js. Products, prices, sales,
// stock and orders are all managed in the dashboard (Admin -> Webstore).
// See the las-aguas-webstore skill for the API contract.

const API_BASE = 'https://lasaguasproductions.com'
const STORE_SLUG = 'lemon-eye-store'

async function request(path, options) {
  const res = await fetch(`${API_BASE}/api/store-public/${path}`, options)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const error = new Error(data.error || `Store request failed (${res.status})`)
    error.status = res.status
    // 4xx messages are written for buyers; server errors are not.
    if (res.status < 500) error.apiMessage = data.error
    throw error
  }
  return data
}

function post(path, body) {
  return request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export const resolveStore = () =>
  request(`resolve?slug=${encodeURIComponent(STORE_SLUG)}`, { cache: 'no-store' })

export const quoteShipping = items => post('quote', { slug: STORE_SLUG, items })

export const createCheckout = order => post('checkout', { slug: STORE_SLUG, ...order })

export const confirmOrder = sessionId => post('confirm', { session_id: sessionId })
