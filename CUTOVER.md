# Website migration: point `balcoffee.com` at the Hydrogen build

This moves the production domain from the legacy Shopify Liquid theme to the
Next.js + Hydrogen storefront on Vercel. The build is done, gated, and already
live on **staging** (`bal-coffee.vercel.app`); this runbook is the launch.

The cutover is **largely irreversible** (DNS + Shopify domain changes) — do the
phases in order, and don't touch apex DNS until Phase A's gate passes.

## State today (verified)

- Build: complete, merged to `main`, CI-gated (static + e2e + DCO + gql.tada),
  full e2e green, deployed to `bal-coffee.vercel.app`.
- `balcoffee.com`: still served by the legacy Shopify Liquid theme.
- **The wrinkle:** the cart's `checkoutUrl` still resolves to `balcoffee.com`.
  If apex DNS moves to Vercel before checkout has its own Shopify host, checkout
  breaks (Shopify stops serving `balcoffee.com/cart/c/…`).

---

## Phase A — Checkout domain (do FIRST, before any apex DNS change)

1. **Shopify admin → Settings → Domains:** add `checkout.balcoffee.com` as a
   Shopify-managed domain. At the DNS host add:
   `checkout.balcoffee.com  CNAME  shops.myshopify.com`
2. **Shopify admin → Settings → Checkout (Plus):** set the checkout to use
   `checkout.balcoffee.com`.
3. **🚦 GATE — verify before continuing.** Confirm the cart now hands out a
   checkout URL on `checkout.balcoffee.com`, not `balcoffee.com`:
   ```bash
   BASE_URL=https://bal-coffee.vercel.app \
   SMOKE_VARIANT_ID=gid://shopify/ProductVariant/48624762913067 \
   SHOPIFY_STORE_DOMAIN=balcoffee-store.myshopify.com \
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=<public token> \
   pnpm smoke
   ```
   Do **not** proceed to Phase C until `checkout host` reports
   `checkout.balcoffee.com`.

## Phase B — Vercel domains + env (can run alongside A)

4. **Vercel → Project → Settings → Domains:** add `balcoffee.com` and
   `www.balcoffee.com` as production domains. Vercel issues a TXT verification
   record — add it at the DNS host.
5. **Vercel → Settings → Environment Variables (Production):** confirm
   `SHOPIFY_STORE_DOMAIN` + `SHOPIFY_STOREFRONT_ACCESS_TOKEN` (or the `PUBLIC_*`
   equivalents). Keep the `unauthenticated_read_product_inventory` scope enabled
   on the Storefront token — the cart 500s without it.
6. Pick a canonical host (recommend `www`) and set the apex → `www` redirect in
   Vercel (308; preserves method for any POST paths).

## Phase C — DNS cutover (irreversible; at the DNS host)

7. Move DNS off Shopify nameservers (transfer the domain to an external
   registrar you control, or point nameservers at your DNS host if Shopify
   allows it for a Shopify-registered domain).
8. Replace records:
   - Apex `A → 76.76.21.21` (Vercel), or `ALIAS`/`ANAME → cname.vercel-dns.com`
     if the host supports it.
   - `www CNAME → cname.vercel-dns.com`
   - **Keep** `checkout CNAME → shops.myshopify.com` (from Phase A).
   - **Re-create** all email-auth records at the new host:
     `apf._domainkey`, `apf2._domainkey`, `apf3._domainkey`, `mailerapf`,
     `_dmarc`. (Missing these breaks outbound email.)
9. Vercel provisions SSL for `balcoffee.com` / `www.balcoffee.com`.

## Phase D — Shopify primary domain + verify

10. **Shopify admin → Settings → Domains:** set the primary domain to
    `checkout.balcoffee.com` so Storefront API checkout URLs use it. Keep
    `balcoffee.com` connected as non-primary if needed.
11. **Smoke test the live domain** — all green, and `checkout host` must be
    `checkout.balcoffee.com`:
    ```bash
    BASE_URL=https://balcoffee.com \
    SMOKE_VARIANT_ID=gid://shopify/ProductVariant/48624762913067 \
    SHOPIFY_STORE_DOMAIN=balcoffee-store.myshopify.com \
    SHOPIFY_STOREFRONT_ACCESS_TOKEN=<public token> \
    pnpm smoke
    ```
12. **Manual end-to-end:** add-to-cart → checkout on `https://balcoffee.com`,
    confirm the Shopify-hosted checkout loads.

## Phase E — Operational close-out

- **Webhooks:** register `products/update` (and orders/customers as needed) in
  Shopify pointing at `/api/shopify/webhooks`, and set `SHOPIFY_WEBHOOK_SECRET`
  in Vercel — otherwise the storefront serves stale product data.
- **Tax regions, shipping zones, payment providers:** verify they're configured
  for the headless checkout (the legacy theme handles these today).
- **Email auth (SPF/DKIM):** finish domain authentication in Shopify admin.
- **404s:** any inbound link to an old Liquid path now hits the Next.js 404 —
  confirm it renders sensibly.

## Risks & rollback

- **Checkout** breaks if apex DNS flips before Phase A — hence the gate.
- **Email** breaks if the DKIM/DMARC records aren't re-created at the new host.
- **Legacy Shopify apps** bound to the Liquid theme (Inbox widget, etc.) stop
  working unless ported.
- **Rollback:** revert nameservers/DNS to Shopify. Propagation is usually
  5–60 min but can take up to 48h — plan the change for a low-traffic window.

See `shopify_checklist.md` for the fuller Phase-0→6 context.
