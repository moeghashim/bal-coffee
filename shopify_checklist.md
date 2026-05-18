# Shopify storefront launch checklist

Distilled from the Babanuj launch. Use this when standing up a new
headless Shopify storefront (Next.js + vercel/commerce style) on a new
custom domain.

The checklist is ordered so each phase unblocks the next. Skip a phase
if the store already meets the prerequisite.

---

## Phase 0 — Pre-flight

- [ ] Decide architecture: headless Next.js (this template) vs. classic
      Shopify theme. The rest of this doc assumes headless.
- [ ] Confirm Shopify plan tier. **Shopify Plus** removed the legacy
      "Custom apps for your store" page — everything routes through the
      **Dev Dashboard**. Plan an extra 5–10 min if you need an Admin API
      token. Non-Plus stores still have the one-click custom app flow.
- [ ] Confirm domain ownership and where DNS lives (registrar /
      Cloudflare / external). You'll need access in Phase 5.
- [ ] List third-party tools needed (loyalty, chat, analytics, email)
      and decide before launch whether they're Phase 1 (gate launch) or
      Phase 6 (after-the-fact).

## Phase 1 — Shopify configuration

### Storefront API token

- [ ] Create a **Storefront-only** custom app in Shopify admin.
      - Plus stores: Dev Dashboard → new app → scopes
        `unauthenticated_read_products`,
        `unauthenticated_read_product_listings`,
        `unauthenticated_read_collections`,
        `unauthenticated_write_checkouts`,
        `unauthenticated_write_customers`. Release → install on store →
        copy the storefront token (it does **not** start with `shpat_`).
- [ ] Save token as `SHOPIFY_STOREFRONT_ACCESS_TOKEN`. Also expose
      `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=<shop>.myshopify.com` for the
      client (used by login + account links).

### Smart Collections for the storefront's category routes

The storefront expects `/collections/<handle>` for every category. The
fallback in `app/collections/[handle]/page.tsx` will tag-search if the
collection doesn't exist yet, but creating real collections is cleaner
and lets you reorder products in admin.

- [ ] Inventory: for each category card in
      `lib/babanuj/data.ts` (`CATEGORIES`), create a Smart Collection
      whose **handle matches the category id** (Shopify auto-derives the
      handle from the title — pick titles that produce the right slug,
      or override the URL handle manually after save).
- [ ] Match the rules to whatever your products are tagged or typed by.
      Useful Shopify Smart Collection conditions:
      - `Tag is equal to <Tag>` (most common)
      - `Type is equal to <product_type>` (NOT the same as Shopify's
        standardized "Product Category" taxonomy — it's the free-text
        Product Type field)
      - "Match any condition" lets you OR multiple tag values for one
        collection (e.g. Cookies = Cookies OR Ka'ak & Maamoul OR
        Ghraybeh & Barazek).
- [ ] Confirm each collection has products. Empty collections fall back
      to the storefront's tag/type search but still render — they just
      look thin.

### Webhooks → revalidate endpoint

The Next.js storefront uses cache tags. Without webhooks, an edit in
Shopify admin won't reflect for up to your TTL.

- [ ] Generate a long secret: `openssl rand -hex 32`. Save as
      `SHOPIFY_REVALIDATION_SECRET` in Vercel env and `.env.local`.
- [ ] In Shopify admin → Settings → Notifications → Webhooks, create
      **6 webhooks**, all pointing to
      `https://<your-vercel-deployment>.vercel.app/api/revalidate?secret=<SECRET>`:
      - `products/create`, `products/update`, `products/delete`
      - `collections/create`, `collections/update`, `collections/delete`
- [ ] ⚠️ **Shopify forbids webhook URLs pointing at any of your
      storefront's own domains** (apex, www, or the custom domain you'll
      later attach in Phase 5). Keep webhooks pinned to the
      `vercel.app` URL — same Vercel deployment serves both, so
      revalidation still works on the live domain.
- [ ] Format: JSON. Webhook API version: latest stable. Save.

### Customer email sender

- [ ] Settings → Notifications → set "Sender email" to a domain you
      control (e.g. `business@<yourdomain>`). Shopify will prompt you to
      add SPF/DKIM TXT records — do that at your registrar.
- [ ] Run the DMARC view-steps wizard if the page surfaces one.

## Phase 2 — Storefront setup (Vercel + Next.js)

- [ ] Fork / clone the storefront template into a new repo.
- [ ] Update brand-specific files: hero copy, brand metadata in
      `lib/babanuj/data.ts` (or equivalent), categories list, OG image
      title.
- [ ] Sweep for hard-coded copy you don't want to keep:
      - Free shipping thresholds (search for `FREE_SHIP_THRESHOLD` and
        `$XX` price callouts)
      - Member / loyalty / trial wording you don't actually offer
      - Default vercel/commerce demo copy in the announce bar, footer
        and PDP shipping rows
- [ ] `pnpm install` then `pnpm dev`. Smoke the home, search, a PDP, a
      collection page, the cart drawer, and `/cart`.
- [ ] Wire `.env.local`:
      ```
      SHOPIFY_STORE_DOMAIN=<shop>.myshopify.com
      NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=<shop>.myshopify.com
      SHOPIFY_STOREFRONT_ACCESS_TOKEN=...
      SHOPIFY_REVALIDATION_SECRET=...
      SITE_NAME=<Brand>
      COMPANY_NAME=<Brand Inc.>
      ```
- [ ] Create the Vercel project (`vercel link` from repo root). Add the
      same env vars in Vercel **Production** environment.
- [ ] First `vercel --prod`. Save the `*.vercel.app` URL — it's the
      webhook target.
- [ ] Set up a pre-push hook (typecheck + build + secrets scan). See
      `.husky/pre-push` in this repo for a template.

## Phase 3 — Catalog & taxonomy hygiene

Audit BEFORE launch — the longer you wait, the more inconsistencies
accumulate.

- [ ] Pull a vendor + tag + product_type inventory via the Storefront
      API:
      ```bash
      curl -s -X POST "https://<shop>.myshopify.com/api/2024-10/graphql.json" \
        -H "X-Shopify-Storefront-Access-Token: $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"query":"{ products(first: 250) { edges { node { vendor productType tags } } } }"}' \
        | jq '...'
      ```
- [ ] Look for the four common landmines:
      - **Vendor typos** (e.g. `Bal Coffe` vs `Bal Coffee`) — products
        with vendor variants don't roll up correctly. Use Shopify
        admin's bulk-edit on the Vendor column to fix.
      - **Empty Product Type** on products you want to surface in a
        type-based Smart Collection. Either set the type or add a tag.
      - **Missing tags** for products that should appear in a Smart
        Collection but don't.
      - **Shopify "Category" ≠ Product Type.** Shopify's standardized
        Category (taxonomy node) is separate from the free-text Product
        Type. Smart Collection rules use Product Type.
- [ ] Use Shopify admin's **bulk add tag** flow for batches:
      Products → filter → select rows → `…` menu → Add tags → search
      or create the tag → Save.
- [ ] For each Smart Collection, sanity-check the product count after
      tagging. Mismatches usually mean a tag case mismatch
      (`baklava` vs `Baklava`) or a product that's still in Draft
      status.
- [ ] Decide what to do with products that don't fit any category:
      either archive them, add a new category for them, or leave them
      visible only via search.

## Phase 4 — Third-party integrations

Each tool here is optional but plan installs **before** DNS switch so
domain-verification mail goes to the right place.

- [ ] **Google Analytics 4**
      - analytics.google.com → Admin → Data Streams → Web → create
        stream for your final domain (not `*.vercel.app`).
      - Copy the `G-XXXXXXXXXX` Measurement ID.
      - Add `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXX` to `.env.local`
        and Vercel Production. Redeploy.
- [ ] **Smile.io (loyalty)**
      - Install from Shopify App Store. Pick a plan (Free tier exists).
      - Headless integration requires a **channel key** from Smile
        dashboard → Apps & integrations → Headless/Custom storefront.
      - Add `NEXT_PUBLIC_SMILE_SHOP_ID=<channel-key>` and redeploy.
- [ ] **Shopify Inbox (chat)**
      - Install Shopify Inbox from App Store. Configure greeting and
        offline behavior in the Inbox admin.
      - Grab the numeric shop ID (visible in the Inbox embed snippet).
      - Add `NEXT_PUBLIC_SHOPIFY_INBOX_SHOP_ID=<id>` and redeploy.
- [ ] **Privacy banner**
      - Settings → Customer privacy → toggle the cookie banner on.
      - Decide opt-in vs opt-out region defaults based on your customer
        geographies.
- [ ] **Email aliases** (`hello@`, `wholesale@`, etc.)
      - Create as forwarders at your email provider / registrar before
        DNS switch so they're live the moment the domain points at
        Vercel.

## Phase 5 — Launch (DNS + smoke test)

- [ ] In Vercel → Project → Settings → Domains, add **both**
      `<yourdomain>.com` and `www.<yourdomain>.com`. Vercel will tell
      you which DNS records it expects.
- [ ] At the registrar, add:
      - `A` record for `<yourdomain>.com` → Vercel's IP (Vercel shows
        this in the Domains UI)
      - `CNAME` for `www.<yourdomain>.com` →
        `cname.vercel-dns.com` (or whatever Vercel surfaces)
- [ ] Decide canonical: usually pick **`www`** and let Vercel 307 the
      apex to it (Vercel does this automatically when both are added).
- [ ] Wait for propagation (check with `dig +short <yourdomain>.com`).
      Vercel will issue the SSL cert automatically.
- [ ] **Smoke test** (replace `babanuj.com` with your domain):
      ```bash
      for path in / /cart /search /collections/<your-handle>; do
        curl -s -o /dev/null -w "%-4{http_code} $path\n" https://www.<yourdomain>.com$path
      done
      # Verify revalidate
      curl -s -X POST "https://www.<yourdomain>.com/api/revalidate?secret=$REVAL_SECRET" \
        -H "x-shopify-topic: products/update"
      # Should return {"status":200,"revalidated":true,...}
      ```
- [ ] **Do NOT** repoint Shopify webhooks at the custom domain
      (Shopify will reject it — see Phase 1 note). Leave them pointed
      at the `*.vercel.app` URL.

## Phase 6 — Post-launch hygiene

- [ ] Set up a `/schedule`-style reminder to review:
      - 30 days post-launch: webhook delivery success rate in Shopify
        admin → Notifications → Webhooks. Failures usually mean the
        secret rotated or the deployment URL changed.
      - 60 days: review the 13-products-without-a-category problem
        repeats over time. Schedule a quarterly taxonomy sweep.
- [ ] If you created a one-off Admin API app for batch operations
      (creating collections, bulk-tagging via API), **delete it after
      use**. Cleaner than leaving long-lived Admin tokens in Shopify.
- [ ] Document store-specific quirks in your team's playbook:
      - Which vendor strings exist and which is canonical
      - Which tags map to which Smart Collections
      - Where the webhooks point and which secret they sign with

---

## Specific gotchas this checklist exists because of

These bit us during the Babanuj launch — encoded here so they don't bite
again.

1. **Shopify Plus removed legacy custom apps.** The flow to get an
   Admin API token now goes through the Dev Dashboard with "Use legacy
   install flow" enabled. The "App automation token" you see in the Dev
   Dashboard is for CI of the app itself, **not** for your store.
2. **Shopify rejects webhook URLs that point at any of your store's
   own domains.** Keep webhooks pinned to a `*.vercel.app` URL — it's
   the same deployment so revalidation works either way.
3. **Storefront API can't tag customers or write notes.** If you build
   a custom form that should save to Shopify as a tagged Customer, you
   need an Admin API token. Storefront API `customerCreate` only
   supports email/password/firstName/lastName/phone.
4. **Apex domains 307 to [www.**](https://www.**) That means tools that don't follow
   redirects on POST (some webhook senders) won't work against the
   apex. Use `www` directly in webhook URLs (or skip the issue entirely
   by using `*.vercel.app` per gotcha 2).
5. **Smart Collections use Product Type, not Shopify Category.** A
   product can have its Shopify standardized Category set to "Honey"
   and still not appear in a Smart Collection that filters on
   `Type is equal to Honey`. Tag-based rules are usually safer.
6. **Newly tagged products don't immediately appear on the storefront
   until the products/update webhook fires.** If you bulk-edit and the
   storefront doesn't refresh, check the webhook log.
7. **Worktree gotcha:** Next.js `position: fixed` descendants of an
   element with `backdrop-filter` get their containing block from the
   blurred element, not the viewport. Portal them to `document.body` if
   you need true viewport positioning (cart drawer, mobile menu).
