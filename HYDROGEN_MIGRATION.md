# Goal: Migrate Bal Coffee to the new Hydrogen toolkit (preview)

**Owner:** Moe · **Branch:** `feat/hydrogen-migration` · **Status:** planned

## Objective

Port the storefront's Shopify integration from the hand-rolled Storefront API
layer to Shopify's new **Hydrogen toolkit** (`@shopify/hydrogen@preview`), while
keeping the project **compatible with upstream so preview updates can be pulled
without breaking the app** — verified by a **full end-to-end test suite** that
gates every change.

We stay on **Next.js (App Router) on Vercel**. Hydrogen is adopted as a _toolkit_
(data/state primitives), not as a framework or a rehost. Checkout stays
**Shopify-hosted**. The bespoke design is unchanged.

> Pre-migration cleanup: the `/pos` café ordering feature was removed
> (branch `chore/remove-pos`) so the migration baselines from a clean
> storefront. It is out of scope for this migration and its e2e coverage.

## Two hard constraints (everything below serves these)

### 1. Pull upstream updates without breaking — via isolation + pinning

The announcement is explicit: **"the API will change."** So:

- `@shopify/hydrogen` is consumed **only as a pinned npm dependency** (exact
  version, no `^`). Never forked or vendored.
- **All Hydrogen APIs live behind `lib/commerce/`** — our own stable interface.
  App and UI code import from `lib/commerce`, **never** from `@shopify/hydrogen`
  directly. An import-boundary lint rule enforces this.
- When upstream changes its API, breakage is contained to `lib/commerce/` and
  caught by e2e — app code and design don't move.
- Version bumps are deliberate: Renovate opens a PR → full e2e runs → adapter
  reviewed → merge only if green.

### 2. Full e2e — authored first, run as the CI gate

- The Playwright suite is written **against the current app first**, so it encodes
  today's correct behavior as the migration contract.
- It becomes a **required CI check** on every PR, especially Hydrogen version
  bumps. No upstream update merges unless render → cart → Shopify checkout →
  analytics/consent all pass end-to-end.

## Sequence (see task list #1–#13)

| #   | Phase         | Task                                                                                               |
| --- | ------------- | -------------------------------------------------------------------------------------------------- |
| 1   | Baseline      | Branch + freeze current behavior as the contract                                                   |
| 2   | Safety net    | Playwright e2e against the **current** app: render → cart → Shopify checkout (must be green first) |
| 3   | Foundation    | Next.js 15 canary → 16, isolated from Hydrogen                                                     |
| 4   | Foundation    | `hydrogen@preview setup`, pin exact version, commit skills                                         |
| 5   | **Isolation** | Build `lib/commerce/` adapter + import-boundary rule                                               |
| 6   | Migrate       | Storefront client → `createStorefrontClient` (behind adapter)                                      |
| 7   | Migrate       | Cart → `createCartStore`/`useCartForm`, keep Shopify checkout                                      |
| 8   | Migrate       | Money formatting → Hydrogen primitives (cent-accurate)                                             |
| 9   | Migrate       | Consent-aware analytics (closes open Phase 4 checklist item)                                       |
| 10  | Verify        | Design identical on new data layer                                                                 |
| 11  | **Upgrades**  | Renovate + upgrade runbook + upstream diff reference                                               |
| 12  | Gate          | Full e2e coverage + CI merge gate + schema-drift check                                             |
| 13  | Ship          | Vercel preview smoke test + rollback plan + docs + sign-off                                        |

## Risk posture

This rides a **developer-preview API**. Mitigations: exact version pin, the
`lib/commerce` isolation boundary, e2e gate on every bump, a rollback commit to
the pre-Hydrogen state, and no merge to `main` without sign-off on a green
Vercel preview. Out-of-scope preview gaps (customer accounts, predictive search)
are already out of Bal's scope, so they don't block us.

## Env var change

`SHOPIFY_STORE_DOMAIN` / `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
→ Hydrogen expects `PUBLIC_STORE_DOMAIN` / `PRIVATE_STOREFRONT_API_TOKEN`
(mapped in `.env.example` + Vercel during task #4).
