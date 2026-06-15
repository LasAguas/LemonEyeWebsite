---
name: project-webstore
description: Stripe-powered webstore added to the Lemon Eye site — architecture, files, and setup steps
metadata:
  type: project
---

Webstore added to the site using the two cassette product images. Uses Stripe Hosted Checkout via a Vercel serverless function.

**Why:** Band wanted to sell the "Out of Reach" limited edition cassette tape directly from their website.

**How to apply:** When working on store or payment features, reference this architecture. The price (£12 in pence = 1200) and product description live in `api/checkout.js` and `src/store.js`.

## Key files

- `store.html` + `src/store.js` — store page (product gallery, quantity picker, checkout button)
- `api/checkout.js` — Vercel serverless function that creates a Stripe Checkout Session
- `.env.local` — gitignored local env file (replace placeholder keys with real test keys)
- `.env.example` — committed template showing what env vars to set
- `vercel.json` — updated with `outputDirectory: dist` and `framework: vite`

## Environment variables needed

| Variable | Where | Purpose |
|---|---|---|
| `STRIPE_SECRET_KEY` | Vercel + `.env.local` | Server-side Stripe API key |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Vercel + `.env.local` | Frontend publishable key (optional for now) |
| `STRIPE_WEBHOOK_SECRET` | Vercel + `.env.local` | Webhook verification (optional) |

## How to test locally

Use `vercel dev` (not `vite dev`) to run both the static site and the serverless `/api/checkout` function together. Requires Vercel CLI (`npm i -g vercel`).

## Vercel dashboard steps

1. Go to project Settings → Environment Variables
2. Add `STRIPE_SECRET_KEY` with the live/test secret key
3. Add `VITE_STRIPE_PUBLISHABLE_KEY` with the live/test publishable key
4. Redeploy for env vars to take effect
