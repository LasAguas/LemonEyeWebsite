import { gigs } from '../data/gigs.js'

export function UpcomingEvent({ wrapperClass = '' } = {}) {
  const next = gigs[0]

  if (!next) {
    return `
      <div class="${wrapperClass} hero-event">
        <p class="hero-event__eyebrow">Next Show</p>
        <p class="hero-event__empty">No upcoming shows right now. <a href="/gigs.html">Check back soon.</a></p>
      </div>
    `
  }

  return `
    <div class="${wrapperClass} hero-event">
      <p class="hero-event__eyebrow">Next Show</p>
      <div class="hero-event__date">
        <span class="hero-event__day">${next.dateLabel.day}</span>
        <div class="hero-event__month-year">
          <span class="hero-event__month">${next.dateLabel.month}</span>
          <span class="hero-event__year">${next.dateLabel.year}</span>
        </div>
      </div>
      <h2 class="hero-event__title">${next.title}</h2>
      <p class="hero-event__meta"><strong>${next.venue}</strong> · ${next.city}</p>
      <p class="hero-event__times">
        <span><span class="hero-event__time-label">Doors</span> ${next.doors}</span>
        <span class="hero-event__sep">·</span>
        <span><span class="hero-event__time-label">Show</span> ${next.show}</span>
      </p>
      ${next.ticketUrl
        ? `<a class="hero-event__btn" href="${next.ticketUrl}" target="_blank" rel="noopener">${next.ticketLabel || 'Tickets'} &rarr;</a>`
        : `<span class="hero-event__btn hero-event__btn--soon">Tickets soon</span>`
      }
    </div>
  `
}
