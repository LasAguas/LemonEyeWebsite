import { UpcomingEvent } from './UpcomingEvent.js'
import { NewsletterForm } from './NewsletterForm.js'
import { gigs } from '../data/gigs.js'
import { SITE_FORM } from '../lib/signup-config.js'

const hasShow = gigs.length > 0

export function Hero() {
  if (hasShow) {
    return `
      <section class="hero">
        ${UpcomingEvent({ wrapperClass: 'hero-event--panel' })}
      </section>
    `
  }

  return `
    <section class="hero">
      ${NewsletterForm({ wrapperClass: 'hero-form hero-form--desktop', slug: SITE_FORM.slug, formId: SITE_FORM.formId })}
    </section>
    <section class="hero-form-mobile">
      ${NewsletterForm({ wrapperClass: 'hero-form', slug: SITE_FORM.slug, formId: SITE_FORM.formId })}
    </section>
  `
}

export { hasShow }
