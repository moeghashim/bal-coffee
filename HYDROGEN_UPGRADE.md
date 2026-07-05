# Upgrading `@shopify/hydrogen` (preview)

Hydrogen is consumed as a **pinned, exact-version** dependency used **only**
behind the `lib/commerce/` adapter (enforced by `scripts/check-import-boundary.mjs`).
The announcement is explicit that _the API will change_, so upgrades are
deliberate and gated. This runbook is the process for bumping it safely.

## The contract

- `@shopify/hydrogen` in `package.json` has **no `^`/`~` range** — an exact
  preview version (e.g. `0.0.0-preview-<sha>-<date>`).
- App and UI code import from `lib/commerce`, **never** from `@shopify/hydrogen`
  directly. Any upstream API drift is absorbed inside `lib/commerce/`.
- Two CI checks are **required on `main`**: `Static checks + build` and
  `E2E (render → cart → checkout)`. No bump merges unless both are green.

## Normal upgrade flow

1. **Renovate opens the PR.** `renovate.json` gives `@shopify/hydrogen` its own
   PR (label `hydrogen-upgrade`), separate from other dependency updates.
2. **CI runs the gate.** The e2e suite (render → cart → Shopify checkout →
   webhook) is the migration contract. If it stays green, the public API the app
   depends on didn't break.
3. **Review the adapter, not the app.** If anything broke, the fix belongs in
   `lib/commerce/` (storefront client, cart handlers/fragment, money, analytics).
   App and UI code should not move. Diff `lib/commerce/` against the previous
   version and reconcile there.
4. **Merge only if green.** Squash or merge once both required checks pass.

## When the e2e goes red

Work through `lib/commerce/` in this order — these are the surfaces most likely
to drift on a preview bump:

- **Storefront client** (`storefront.ts`, `products.ts`) — client factory shape,
  `graphql()` signature, query field availability.
- **Cart** (`cart-handlers.ts`, `cart-client.tsx`, `routes.ts`) — the default
  cart fragment, `createCartServerHandlers`/`createCartComponents` API,
  `handleShopifyRoutes` signature, `ProductInput` shape for add-to-cart. Note the
  cart requires the `unauthenticated_read_product_inventory` Storefront scope.
- **Money** (`money.ts`) — `formatMoney` return shape.
- **Analytics** (`analytics.ts`) — `createStorefrontAnalytics` options / consent
  config.

Because these are the only files allowed to import `@shopify/hydrogen`, breakage
is contained here by construction.

## Manual upgrade (without Renovate)

```bash
# pick the new exact preview version, then:
pnpm add -E @shopify/hydrogen@<exact-version>
pnpm install
git commit -s -am "chore(deps): bump @shopify/hydrogen to <version>"
# open a PR; let the required gate run.
```

Keep the packaged skills under `.claude/skills/` in sync with the installed
version when the toolkit ships new guidance.

## Notes

- **Renovate app** must be installed on the repo for step 1 to fire; until then,
  use the manual flow.
- **DCO:** the repo requires a `Signed-off-by` trailer (`pnpm run hooks:install`
  wires it automatically for local commits). If Renovate's bot PRs fail DCO,
  allow the bot in a `.github/dco.yml` or configure Renovate to sign off.
