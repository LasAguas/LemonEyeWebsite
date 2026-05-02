import { UpcomingEvent } from './UpcomingEvent.js'
import { NewsletterForm } from './NewsletterForm.js'
import { gigs } from '../data/gigs.js'

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
      ${NewsletterForm({ wrapperClass: 'hero-form' })}
    </section>
    <section class="hero-mobile-form">
      ${NewsletterForm({ wrapperClass: 'mobile-newsletter' })}
    </section>
  `
}

export { hasShow }
