import { NewsletterForm } from './NewsletterForm.js'

export function Hero() {
  return `
    <section class="hero">
      ${NewsletterForm({ wrapperClass: 'hero-form' })}
    </section>
    <section class="hero-mobile-form">
      ${NewsletterForm({ wrapperClass: 'mobile-newsletter' })}
    </section>
  `
}
