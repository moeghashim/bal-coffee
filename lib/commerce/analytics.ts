import {
  AnalyticsEvent,
  createStorefrontAnalytics,
  type AnalyticsCart,
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

type StoreCartLine = {
  id: string;
  quantity: number;
  cost?: {
    amountPerQuantity?: { amount?: string; currencyCode?: string } | null;
  };
  merchandise?: {
    id?: string;
    title?: string;
    product?: {
      id?: string;
      title?: string;
      vendor?: string | null;
      handle?: string;
    } | null;
  } | null;
};

type StoreCart = {
  id?: string | null;
  updatedAt?: string | null;
  lines?: { nodes?: StoreCartLine[] };
};

/**
 * Map the client cart store's cart into the `AnalyticsCart` shape the bus's
 * `updateCart()` diffs for cart-delta events. Unit price comes from
 * `cost.amountPerQuantity` (in the default fragment), so the merchandise
 * selection doesn't need widening — only `updatedAt` (added in cart-handlers).
 */
export function toAnalyticsCart(
  data: StoreCart | null | undefined,
): AnalyticsCart | null {
  if (!data?.id || !data.updatedAt) return null;

  return {
    id: data.id,
    updatedAt: data.updatedAt,
    lines: {
      nodes: (data.lines?.nodes ?? []).map((line) => ({
        id: line.id,
        quantity: line.quantity,
        merchandise: {
          id: line.merchandise?.id ?? "",
          title: line.merchandise?.title ?? "",
          price: {
            amount: line.cost?.amountPerQuantity?.amount ?? "0",
            currencyCode: line.cost?.amountPerQuantity?.currencyCode,
          },
          product: {
            id: line.merchandise?.product?.id ?? "",
            title: line.merchandise?.product?.title ?? "",
            vendor: line.merchandise?.product?.vendor ?? "",
            handle: line.merchandise?.product?.handle,
          },
        },
      })),
    },
  };
}
