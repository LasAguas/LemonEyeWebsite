// Native Las Aguas mailing-list signup: a collapsible "Join the mailing
// list" button that expands into a form, for link-in-bio style pages.
//
// Sign-ups land in the Lemon Eye customer list in the Las Aguas dashboard
// (Mailing -> Customers), carrying where they came from: the page, the
// referrer, any UTM tags, plus device/OS/browser/location derived server-side.
// See src/lib/signup-config.js for which dashboard form each call site uses.
//
// Fields not enabled on the target dashboard form are silently dropped by the
// API, so keep the `fields` passed in sync with that form's config.

import { trackPageview, submitSignup } from '../lib/signup-api.js'

let instanceCount = 0

const FIELD_CONFIG = {
  name: { label: 'Name', autocomplete: 'name' },
  city: { label: 'City', autocomplete: 'address-level2' },
}

export function SignupForm({ slug, formId = '', label = 'Join the mailing list', fields = ['name'], expanded = false } = {}) {
  if (!slug) throw new Error('SignupForm requires a slug')

  const uid = ++instanceCount
  const open = expanded ? 'true' : 'false'
  const panelId = `signup-panel-${uid}`

  const fieldsHTML = fields.map(key => {
    const cfg = FIELD_CONFIG[key]
    if (!cfg) return ''
    const inputId = `signup-${key}-${uid}`
    return `
      <div class="field signup__field">
        <label for="${inputId}">${cfg.label}</label>
        <input type="text" name="${key}" id="${inputId}" autocomplete="${cfg.autocomplete}">
      </div>
    `
  }).join('')

  return `
    <div class="signup" data-slug="${slug}" data-form-id="${formId}" data-expanded="${open}">
      <button type="button" class="gig-button signup__toggle"
              aria-expanded="${open}" aria-controls="${panelId}">
        ${label} <span class="signup__chev" aria-hidden="true">&darr;</span>
      </button>

      <div id="${panelId}" class="signup__panel"${expanded ? '' : ' hidden'}>
        <form class="signup__form" novalidate>
          <!-- honeypot: humans never fill this in, bots do -->
          <input type="text" name="website" tabindex="-1" autocomplete="off"
                 aria-hidden="true" class="signup__hp">

          ${fieldsHTML}

          <div class="field signup__field">
            <label for="signup-email-${uid}">Email <span class="asterisk">*</span></label>
            <input type="email" name="email" id="signup-email-${uid}" required
                   aria-required="true" autocomplete="email">
          </div>

          <button type="submit" class="gig-button signup__submit">Sign up</button>
          <p class="signup__msg" role="status" aria-live="polite"></p>
        </form>
      </div>
    </div>
  `
}

export function initSignupForm() {
  const roots = document.querySelectorAll('.signup')
  if (!roots.length) return

  const trackedFormIds = new Set()

  roots.forEach(root => {
    const slug = root.dataset.slug
    const formId = root.dataset.formId

    // One pageview per distinct form, even if it renders more than once
    // (e.g. a desktop/mobile pair of the same form on one page).
    if (formId && !trackedFormIds.has(formId)) {
      trackedFormIds.add(formId)
      trackPageview(formId)
    }

    const toggle = root.querySelector('.signup__toggle')
    const panel = root.querySelector('.signup__panel')
    const form = root.querySelector('.signup__form')
    const msg = form.querySelector('.signup__msg')
    const submit = form.querySelector('.signup__submit')
    const el = form.elements // avoids the form.name / form.action property clash

    toggle.addEventListener('click', () => {
      const open = root.dataset.expanded === 'true'
      root.dataset.expanded = open ? 'false' : 'true'
      toggle.setAttribute('aria-expanded', open ? 'false' : 'true')
      panel.hidden = open
      if (!open) el.email.focus()
    })

    form.addEventListener('submit', async e => {
      e.preventDefault()
      if (el.website.value) return // honeypot tripped - drop silently

      msg.textContent = ''
      msg.classList.remove('signup__msg--error')

      const email = el.email.value.trim()
      if (!email) {
        msg.textContent = 'Please enter your email address.'
        msg.classList.add('signup__msg--error')
        el.email.focus()
        return
      }

      submit.disabled = true
      submit.textContent = 'Signing up…'

      const values = { email }
      ;['name', 'city'].forEach(key => { if (el[key]) values[key] = el[key].value })

      try {
        const data = await submitSignup(slug, values)
        form.innerHTML = `<p class="signup__done">${data.message || "Thanks — you're signed up!"}</p>`
      } catch (err) {
        msg.textContent = err.message || 'Something went wrong. Please try again.'
        msg.classList.add('signup__msg--error')
        submit.disabled = false
        submit.textContent = 'Sign up'
      }
    })
  })
}
