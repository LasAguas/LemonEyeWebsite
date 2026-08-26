// Native Las Aguas mailing-list signup: an always-visible "Get on the
// Newsletter" form (homepage hero / newsletter section) — no expand/collapse.
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

export function NewsletterForm({ wrapperClass = '', slug, formId = '', fields = ['name', 'city'] } = {}) {
  if (!slug) throw new Error('NewsletterForm requires a slug')

  const uid = ++instanceCount

  const fieldsHTML = fields.map(key => {
    const cfg = FIELD_CONFIG[key]
    if (!cfg) return ''
    const inputId = `newsletter-${key}-${uid}`
    return `
      <div class="field">
        <label for="${inputId}">${cfg.label}</label>
        <input type="text" name="${key}" id="${inputId}" autocomplete="${cfg.autocomplete}">
      </div>
    `
  }).join('')

  return `
    <div class="${wrapperClass}" data-slug="${slug}" data-form-id="${formId}">
      <h2 class="hero-form__heading">Get on the Newsletter</h2>
      <form class="newsletter-form" novalidate>
        <p class="required-note"><span class="asterisk">*</span> indicates required</p>

        <div class="field">
          <label for="newsletter-email-${uid}">Email Address <span class="asterisk">*</span></label>
          <input type="email" name="email" id="newsletter-email-${uid}" required aria-required="true" autocomplete="email">
        </div>

        ${fieldsHTML}

        <!-- honeypot: humans never fill this in, bots do -->
        <input type="text" name="website" tabindex="-1" autocomplete="off"
               aria-hidden="true" class="signup__hp">

        <p class="signup__msg" role="status" aria-live="polite"></p>

        <button type="submit" class="btn-subscribe">Subscribe</button>
      </form>
    </div>
  `
}

export function initNewsletterForm() {
  const forms = document.querySelectorAll('.newsletter-form')
  if (!forms.length) return

  const trackedFormIds = new Set()

  forms.forEach(form => {
    const wrapper = form.closest('[data-slug]')
    const slug = wrapper.dataset.slug
    const formId = wrapper.dataset.formId

    // One pageview per distinct form, even if it renders more than once
    // (e.g. the desktop/mobile pair of the hero form on one page).
    if (formId && !trackedFormIds.has(formId)) {
      trackedFormIds.add(formId)
      trackPageview(formId)
    }

    const msg = form.querySelector('.signup__msg')
    const submit = form.querySelector('.btn-subscribe')
    const el = form.elements // avoids the form.name / form.action property clash

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
      submit.textContent = 'Subscribing…'

      const values = { email }
      ;['name', 'city'].forEach(key => { if (el[key]) values[key] = el[key].value })

      try {
        const data = await submitSignup(slug, values)
        form.innerHTML = `<p class="signup__done">${data.message || "Thanks — you're signed up!"}</p>`
      } catch (err) {
        msg.textContent = err.message || 'Something went wrong. Please try again.'
        msg.classList.add('signup__msg--error')
        submit.disabled = false
        submit.textContent = 'Subscribe'
      }
    })
  })
}
