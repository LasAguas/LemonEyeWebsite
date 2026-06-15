// "Hold cursors" feature: when two visitors rest their cursors near each other
// for a moment, little yellow hearts float up from the meeting point.
//
// Real-time cursor presence is provided by playhtml (https://github.com/spencerc99/playhtml),
// which syncs cursors through its hosted PartyKit server — no backend required.
// playhtml gives us built-in proximity detection; the "hold" dwell timing and the
// heart animation below are the custom layer on top of it.

import { playhtml } from 'playhtml'
import 'playhtml/dist/style.css'
import './cursor-hearts.css'

// How close two cursors must be (px) before they count as "together".
const PROXIMITY_THRESHOLD = 44
// How long they must stay together before hearts start (the "hold").
const HOLD_MS = 650
// How often a heart spawns while the hold continues.
const HEART_INTERVAL_MS = 420

// Tracks active proximity sessions. Keyed by the other player's stable id when
// available, otherwise a positional fallback key.
const sessions = new Map()

function heartSVG() {
  // Lemon-yellow heart to match the Lemon Eye palette.
  return `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#FFD43B" stroke="#E6A700" stroke-width="1"
        d="M12 21s-7.5-4.7-10-9.2C.4 8.6 2 5 5.4 5c2 0 3.4 1.1 4.3 2.4l.3.5.3-.5C11.2 6.1 12.6 5 14.6 5 18 5 19.6 8.6 18 11.8 15.5 16.3 12 21 12 21Z"/>
    </svg>`
}

function spawnHeart(x, y) {
  const heart = document.createElement('div')
  heart.className = 'cursor-heart'
  heart.innerHTML = heartSVG()
  // Small random jitter so repeated hearts don't stack perfectly.
  heart.style.left = `${x + (Math.random() * 16 - 8)}px`
  heart.style.top = `${y + (Math.random() * 8 - 4)}px`
  document.body.appendChild(heart)
  heart.addEventListener('animationend', () => heart.remove())
}

function midpoint(positions) {
  const { ours, theirs } = positions
  return { x: (ours.x + theirs.x) / 2, y: (ours.y + theirs.y) / 2 }
}

function endAllSessions() {
  for (const session of sessions.values()) {
    clearTimeout(session.holdTimer)
    clearInterval(session.emitter)
  }
  sessions.clear()
}

export function initCursorHearts() {
  playhtml.init({
    cursors: {
      enabled: true,
      proximityThreshold: PROXIMITY_THRESHOLD,

      onProximityEntered: (identity, positions) => {
        if (!positions) return
        const key = identity?.publicKey || `${Math.round(positions.theirs.x)}:${Math.round(positions.theirs.y)}`
        if (sessions.has(key)) return

        const mid = midpoint(positions)
        const holdTimer = setTimeout(() => {
          spawnHeart(mid.x, mid.y)
          const emitter = setInterval(() => spawnHeart(mid.x, mid.y), HEART_INTERVAL_MS)
          const session = sessions.get(key)
          if (session) session.emitter = emitter
        }, HOLD_MS)

        sessions.set(key, { holdTimer, emitter: null, mid })
      },

      // playhtml reports the connection id on leave, which doesn't always map
      // back to the publicKey-based session key. Cursors only make hearts while
      // held still together, so clearing all active sessions on any "leave" is
      // both simple and correct for the common one-other-cursor case.
      onProximityLeft: () => endAllSessions(),
    },
  })
}
