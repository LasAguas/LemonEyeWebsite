// Shared submission logic for the site's native Las Aguas mailing-list
// signup forms (src/components/SignupForm.js and NewsletterForm.js).
// See the las-aguas-signup-form skill for the dashboard API contract.

const API_BASE = 'https://lasaguasproductions.com'
const TOKEN_KEY = 'laf_sid'

// Mirrors the consent model in public/assets/js/tracker.js.
function hasConsent() {
  return /(?:^|;\s*)le_consent=true(?:;|$)/.test(document.cookie)
}

// Ties a pageview to a later sign-up. Only persists across visits once
// cookies have been accepted; before that it lives for this visit only, so
// no cross-visit identifier is stored without consent.
export function sessionToken() {
  const fallback = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`
  const make = () => (window.crypto && crypto.randomUUID && crypto.randomUUID()) || fallback()
  try {
    let token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
    if (!token) {
      token = make()
      const store = hasConsent() ? localStorage : sessionStorage
      store.setItem(TOKEN_KEY, token)
    }
    return token
  } catch {
    return fallback()
  }
}

// Production serves clean URLs (/socials), but a page can also be reached as
// /socials.html in dev. Normalise so attribution reads the same either way,
// matching the pageSlug handling in public/assets/js/tracker.js.
export function sourcePath() {
  return location.pathname.replace(/\.html$/, '').replace(/(.)\/$/, '$1') || '/'
}

function readUTM() {
  const p = new URLSearchParams(location.search)
  return {
    source: p.get('utm_source') || undefined,
    medium: p.get('utm_medium') || undefined,
    campaign: p.get('utm_campaign') || undefined,
    content: p.get('utm_content') || undefined,
    term: p.get('utm_term') || undefined,
  }
}

// Records a pageview -> referrer, UTM, language (+ device/geo server-side).
// Fire-and-forget: analytics must never block or break the page.
export function trackPageview(formId) {
  if (!formId) return
  fetch(`${API_BASE}/api/forms-public/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({
      formId,
      sessionToken: sessionToken(),
      referrer: document.referrer,
      utm: readUTM(),
      language: navigator.language,
    }),
  }).catch(() => {})
}

// Submits a sign-up. `values` is a flat {fieldName: value} map (email, name,
// city, ...); blank values are omitted. source_path/session_token are added
// automatically. Resolves to the API's JSON body; throws an Error with a
// user-facing message on failure.
export async function submitSignup(slug, values) {
  const payload = {
    slug,
    source_path: sourcePath(),
    session_token: sessionToken(),
  }
  Object.entries(values).forEach(([key, value]) => {
    if (value && String(value).trim()) payload[key] = String(value).trim()
  })

  const res = await fetch(`${API_BASE}/api/forms-public/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Something went wrong.')
  return data
}
