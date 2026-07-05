import {
  AnalyticsEvent,
  createStorefrontAnalytics,
  type ShopAnalytics,
  type StorefrontAnalytics,
} from "@shopify/hydrogen";

/**
 * Browser-lazy analytics singleton behind the commerce boundary (all Hydrogen
 * imports stay in lib/commerce — HYDROGEN_MIGRATION.md). The bus is browser-only
 * effective: it loads Shopify's Customer Privacy API + hosted privacy banner
 * (`mode: "default-banner"`), gates every destination on consent, and dispatches
 * page/product/cart events to Shopify analytics.
 *
 * App code passes server-resolved `ShopAnalytics` (shop GID, market) via props;
 * this module never reads env in the browser.
 */
export { AnalyticsEvent };
export type { ShopAnalytics };

let bus: StorefrontAnalytics | null = null;
let analyticsShop: ShopAnalytics | null = null;

export function configureAnalytics(shop: ShopAnalytics) {
  analyticsShop = shop;
}

export function getAnalyticsShop(): ShopAnalytics | null {
  return analyticsShop;
}

export function getAnalytics(): StorefrontAnalytics | null {
  if (typeof window === "undefined") return null;
  if (!analyticsShop) return null;

  bus ??= createStorefrontAnalytics({
    shop: analyticsShop,
    // Shopify's hosted Customer Privacy API decides per-visitor geography whether
    // consent is required and renders its banner when it is. canTrack defaults to
    // the SDK's analyticsProcessingAllowed() — never override in production.
    consent: { mode: "default-banner", country: "US", language: "EN" },
  });

  return bus;
}
