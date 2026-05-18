# Shopify Storefront Launch Checklist

A phased checklist for setting up a headless Shopify storefront, from architecture decisions through post-launch maintenance.

---

## Phase 0 — Pre-flight

Decide architecture + Plus-vs-non-Plus differences before you start.

- [x] **Shopify plan tier: Plus**
- [x] **Headless** (not a Liquid theme)
- [x] **Framework + hosting: Next.js 15 (App Router) on Vercel** (`bannaa` team, `bal-coffee` project)
- [x] **APIs: Storefront API only for now** — no Admin API, no Customer Account API yet
- [x] **Checkout: default Shopify-hosted checkout** (no Checkout Extensibility customization)
- [ ] Inventory the Plus-only features you actually need (B2B, Functions, Markets Pro, Flow) — currently none in scope
- [x] **App model: Dev Dashboard** (Plus stores were migrated off legacy Custom Apps)
- [x] **CMS: Shopify-only** (products + editorial via metafields, no external CMS)

---

## Phase 1 — Shopify configuration

Storefront API token, Smart Collections, webhooks, sender email.

- [x] **Storefront API token** generated in Headless channel (`Bal Coffee Store Headless`); public token in `.env.local`, private token also exists
- [ ] Generate an **Admin API token** — skipped for now (no Admin-only writes needed yet)
- [x] **Smart Collections created (2):**
  - [x] **All Products** — Vendor is equal to `BAL Coffee` (3 active products auto-included)
  - [x] **Subscriptions** — Tag is equal to `subscription` (empty until products are tagged)
- [ ] **Webhooks — deferred.** No `/api/*` receiver route exists in the Next.js storefront yet; registering webhooks now would deliver to 404s. Build receiver first, then register:
  - [ ] `orders/create`
  - [ ] `orders/updated`
  - [ ] `orders/paid`
  - [ ] `products/create`
  - [ ] `products/update`
  - [ ] `customers/create`
- [x] **Sender email** set: `info@balcoffee.com`
- [ ] **SPF/DKIM not yet set up** — "Email domain authentication: Needs setup" in admin; DNS records pending at registrar
- [ ] Enable customer accounts (Classic vs. New — pick one and stick with it)
- [ ] Set up tax regions, shipping zones, and payment providers (legacy theme handles these today; verify before Phase 5 cutover)

### Phase 1 catalog cleanup (completed)

Done as part of the Phase 1 pass since the audit surfaced these immediately:

- [x] **Vendor normalized to `BAL Coffee`** on all 12 products (previously: `BalCoffee Store`, `My Store`, `BAL Coffee`)
- [x] **9 products archived** (old/test): Hot latte, Brown Sugar, Caramel Glow, Pistachio Caramel, Honey Iced lattee, Deluxe Blend, Tiramisu Dream, Date Seeds Deglet Noor - 30lbs, Date Seeds Medjool - 30lbs
- [x] Active products on Storefront API: DateSpresso, GrounDate, Eastern Brew

---

## Phase 2 — Storefront setup

Fork template, brand swap, env vars, first deploy.

- [ ] Fork the chosen starter template (Next.js Commerce / Hydrogen / custom)
- [ ] Brand swap: logo, fonts, color tokens, favicons, OG image
- [ ] Wire env vars in local + Vercel:
  - [ ] `SHOPIFY_STORE_DOMAIN`
  - [ ] `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
  - [ ] `SHOPIFY_ADMIN_ACCESS_TOKEN` (if needed)
  - [ ] `SHOPIFY_REVALIDATION_SECRET` (for webhook-driven ISR)
- [ ] Confirm product/collection/cart pages render with live Shopify data
- [ ] Hook up webhook receiver routes (e.g. `/api/revalidate`) and validate HMAC signatures
- [ ] First Vercel preview deploy — confirm env vars, build, and image domains
- [ ] Set up preview branch for staging

---

## Phase 3 — Catalog & taxonomy hygiene

The vendor-typo / empty-type / missing-tag audit we did via Storefront API.

- [ ] Pull all products via Storefront API into a spreadsheet for audit
- [ ] **Vendor typo sweep** — group by vendor, flag near-duplicates (case, whitespace, spelling)
- [ ] **Empty product type sweep** — list products with no Product Type (these will fall out of Smart Collection rules)
- [ ] **Missing tag sweep** — list products missing required tags for filtering / merchandising
- [ ] Normalize Product Type values to match the Smart Collection rule set exactly (case-sensitive)
- [ ] Check that every product has at least one image, a description, and price
- [ ] Audit handles for SEO-friendliness (no random IDs, no duplicates)
- [ ] Set up a saved query / script to re-run this audit quarterly

---

## Phase 4 — Third-party integrations

GA4, privacy banner, email aliases.

- [ ] **GA4** — install via custom pixel or Tag Manager; verify ecommerce events (view_item, add_to_cart, purchase) fire from headless storefront
- [ ] **Privacy / cookie banner** — install consent management (Shopify Customer Privacy API or Osano / Cookiebot), wire to GA4 consent mode
- [ ] **Email aliases** — set up `hello@`, `orders@`, `support@` and forward to the right humans
- [ ] Configure Klaviyo / Shopify Email flows (welcome, abandoned cart, post-purchase)
- [ ] Verify all third-party scripts respect consent state

---

## Phase 5 — Launch (DNS + smoke test)

Vercel domain config, apex→www, smoke script.

- [ ] Add production domain in Vercel (both `apex.com` and `www.apex.com`)
- [ ] Set DNS: A record for apex → Vercel anycast IP, CNAME for www → `cname.vercel-dns.com`
- [ ] Pick a canonical host (recommend `www`) and configure apex → www **redirect** in Vercel (note: this is a 307/308, which preserves method — relevant for any POST endpoints hit on apex)
- [ ] Update Shopify checkout domain settings and any webhook URLs to use the canonical host
- [ ] Run smoke test script against production:
  - [ ] Homepage 200
  - [ ] Collection page 200
  - [ ] Product page 200
  - [ ] Add-to-cart succeeds
  - [ ] Checkout redirect to Shopify works
  - [ ] Webhook endpoints return 200 on test ping
  - [ ] OG tags + sitemap.xml + robots.txt look right
- [ ] Flip DNS / remove "coming soon" gate

### Cutover plan for `balcoffee.com` (current state captured during Phase 1 audit)

Today, `balcoffee.com` is served by the legacy Shopify Liquid theme — DNS is managed by Shopify nameservers and the apex resolves to `23.227.38.73` (Shopify). The Next.js storefront lives at `bal-coffee.vercel.app`. Cart permalinks from the Storefront API hard-code `https://balcoffee.com/cart/c/<token>`, so checkout is dependent on Shopify continuing to serve some path on `balcoffee.com`. That's the wrinkle.

Recommended order — **none of this is reversible quickly, so each step needs explicit approval before executing:**

1. **Add a checkout subdomain on Shopify side.** Add `checkout.balcoffee.com` as a Shopify-controlled domain (CNAME → `shops.myshopify.com`). This becomes Shopify's home on your domain after the storefront moves to Vercel. Configure Shopify to use it for the checkout URLs (Settings → Checkout → custom domain on Plus).
2. **Verify Storefront API now returns checkout URLs that use `checkout.balcoffee.com`** instead of `balcoffee.com`. Test add-to-cart → checkout against the Vercel preview to confirm.
3. **In Vercel project, add `balcoffee.com` and `www.balcoffee.com` as production domains.** Vercel issues a DNS verification record (TXT) — add it in the current Shopify-managed DNS panel temporarily.
4. **Move DNS off Shopify nameservers.** Either:
   - **Recommended:** Transfer the domain (`balcoffee.com` is registered through Shopify) to an external registrar you control (Cloudflare, NameSilo, etc.). Shopify will charge $14 to release; the new registrar takes over DNS.
   - **Alternative:** Keep Shopify as registrar but point nameservers at your DNS host. Shopify doesn't always allow this on Shopify-registered domains — confirm with Shopify support.
5. **At the new DNS host, replace records:**
   - Apex A → `76.76.21.21` (Vercel) — or `ALIAS`/`ANAME` if your DNS host supports it.
   - `www` CNAME → `cname.vercel-dns.com`.
   - Keep all the email auth records (`apf._domainkey`, `apf2._domainkey`, `apf3._domainkey`, `mailerapf`, `_dmarc`) — these need to be re-created at the new DNS host.
   - Keep `checkout.balcoffee.com` CNAME → `shops.myshopify.com`.
6. **Vercel provisions SSL.** Confirm `balcoffee.com` now serves the Next.js storefront.
7. **In Shopify Admin → Domains, change Primary domain from `balcoffee.com` to `checkout.balcoffee.com`** so Storefront API checkout URLs use the right host. (May also need to keep `balcoffee.com` connected as a non-primary domain for completeness.)
8. **Run the Phase 5 smoke script** against `https://balcoffee.com` (now Next.js) end-to-end including checkout redirect.

**Risks:**
- Email continues to work because the DKIM/DMARC records are re-created at the new DNS host.
- Any inbound link or marketing campaign hitting `balcoffee.com/whatever-liquid-path` will hit Next.js — make sure 404s have a sensible page.
- The legacy Liquid theme's storefront and any installed apps depending on it (Inbox widget, etc.) stop working unless ported to the headless storefront.
- DNS propagation can take up to 48h though it's usually 5–60 minutes; have a rollback plan (revert nameservers).

---

## Phase 6 — Post-launch hygiene

Webhook monitoring, quarterly taxonomy sweep, delete one-off Admin apps.

- [ ] Set up webhook delivery monitoring (Shopify's webhook reliability dashboard + your own logs) — alert on failures
- [ ] Schedule the **quarterly taxonomy sweep** from Phase 3 as a recurring calendar item
- [ ] Delete any one-off Admin API apps created for migrations / bulk edits — leftover tokens are an attack surface
- [ ] Rotate the Storefront and Admin API tokens annually (or sooner on staff turnover)
- [ ] Review installed apps quarterly — uninstall anything unused (each app is a data-sharing relationship)
- [ ] Monitor Core Web Vitals and Shopify storefront API latency
- [ ] Keep a changelog of Shopify platform changes that affect you (Plus migration emails, API version deprecations)

---

## Specific gotchas this checklist exists because of

The seven things that actually surprised us during this build:

1. **Shopify Plus removed legacy custom apps → Dev Dashboard.** If you're on Plus, the old "Apps → Develop apps" path is gone. You create apps in the Shopify Dev Dashboard (partners.shopify.com-style flow) and install them into the store. Older docs and blog posts still describe the legacy flow — ignore them.

2. **Webhooks can't target your storefront's own domains.** Shopify refuses to register a webhook whose URL points at a domain that's configured on the same Shopify store (apex or www). Use a separate domain, a subdomain not attached to the store, or your Vercel deployment URL.

3. **Storefront API can't tag customers or write notes.** Anything that mutates customer-side metadata (tags, notes, metafields on customers/orders) requires the **Admin API**. Plan for a server-side route with the Admin token; don't try to do it from the browser.

4. **Apex 307s to www — affects POST endpoints.** If you canonicalize on `www`, a POST to the apex domain gets a 307 redirect. Most clients re-issue the POST, but some (older curl, certain bots, some webhook senders) don't. Make sure every integration is configured with the canonical host directly.

5. **Smart Collection rules use Product Type, not Shopify's standardized Category taxonomy.** Shopify added a global Category field separate from Product Type. Smart Collection rules still look at Product Type. If you only set Category, your Smart Collections will be empty — set Product Type explicitly and keep it consistent.

6. **Newly tagged products only show after `products/update` webhook fires.** A headless storefront caches product data. If you tag a product in the Shopify admin but the webhook hasn't fired (or your revalidation route is broken), the storefront keeps serving the stale, un-tagged version. Check webhook delivery before debugging your filter code.

7. **`backdrop-filter` containing-block gotcha for `position: fixed` portals.** Any ancestor with `backdrop-filter` (or `filter`, `transform`, `perspective`, `will-change`) becomes the containing block for `position: fixed` descendants — so your modal/drawer portal stops being viewport-fixed and gets clipped. Portal the element to `document.body`, or move the `backdrop-filter` off the ancestor.
