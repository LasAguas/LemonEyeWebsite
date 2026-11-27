---
name: project-webstore
description: Lemon Eye webstore sold through the Las Aguas dashboard store API: architecture, files and setup
metadata:
  type: project
---

The site's store page renders products from the Las Aguas dashboard store `lemon-eye-store` and sends the buyer to the dashboard's Stripe Checkout. It replaced the site's own Stripe function (`api/checkout.js`, £12 hardcoded) in November 2026.

**Why:** Prices, stock, sales, pre-orders, shipping and orders are managed in one place, and dashboard sales only reach a storefront that reads the dashboard API.

**How to apply:** Never hardcode products or prices in the site. Edit them in the dashboard (Admin, then Webstore). See the `las-aguas-webstore` skill for the API contract.

## Key files

- `store.html` + `src/store.js`: store page (gallery, options, quantity, shipping choice, checkout, receipt)
- `src/lib/store-api.js`: API calls and the store slug
- `src/lib/store-prices.js`: price, sale and date formatting

## Rules for sales

- On sale exactly when `discount` is not null
- Show `price_cents` and `original_price_cents` as given; never compute from the percentage

## Needed before it works live

1. Products added to the dashboard store, with prices in EUR
2. Store published
3. The site's hostname listed in `STORE_RETURN_URL_ALLOWLIST` on the dashboard's Vercel project

The old `STRIPE_*` variables and the `stripe` dependency are no longer used by this site.
