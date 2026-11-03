/**
 * Google Analytics 4 (gtag) for the storefront.
 *
 * The tag and every ecommerce event no-op unless NEXT_PUBLIC_GA_MEASUREMENT_ID
 * is set, so a deploy without that variable does not load gtag or emit events.
 * Payloads are limited to product ids, names, prices, quantities, and USD.
 * Do not add customer fields (name, email, phone, address, payment).
 *
 * `purchase` is intentionally not sent here. Checkout and payment run on
 * Shopify (checkout.balcoffee.com). Purchase events and cross-domain session
 * stitching require the same Measurement ID on Shopify (Google & YouTube
 * channel or a customer-events pixel) and GA4 cross-domain configuration for
 * www.balcoffee.com and checkout.balcoffee.com. This module does not change
 * Shopify.
 */

export const GA_CURRENCY = "USD" as const;

const MEASUREMENT_ID = /^G-[A-Z0-9]+$/i;

export type GaItem = {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
  currency: typeof GA_CURRENCY;
};

export type GaEcommerceParams = {
  currency: typeof GA_CURRENCY;
  value: number;
  items: GaItem[];
};

export type GaEcommerceEvent =
  | "view_item"
  | "add_to_cart"
  | "view_cart"
  | "begin_checkout";

type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

type GaCartLine = {
  quantity?: number | null;
  merchandise?: {
    id?: string | null;
    title?: string | null;
    product?: {
      id?: string | null;
      title?: string | null;
    } | null;
  } | null;
  cost?: {
    amountPerQuantity?: {
      amount?: string | null;
    } | null;
  } | null;
};

/** Public GA4 measurement id, or undefined when analytics must stay off. */
export function gaMeasurementId(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  if (!raw || !MEASUREMENT_ID.test(raw)) return undefined;
  return raw;
}

export function toGaItem(input: {
  itemId?: string | null;
  itemName?: string | null;
  price?: number | string | null;
  quantity?: number | null;
}): GaItem | null {
  const itemId = input.itemId?.trim();
  const itemName = input.itemName?.trim();
  if (!itemId || !itemName) return null;

  return {
    item_id: itemId,
    item_name: itemName,
    price: normalizePrice(input.price),
    quantity: normalizeQuantity(input.quantity),
    currency: GA_CURRENCY,
  };
}

export function ecommerceParams(items: GaItem[]): GaEcommerceParams {
  const value = roundMoney(
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );
  return {
    currency: GA_CURRENCY,
    value,
    items,
  };
}

export function cartLinesToGaItems(lines: readonly GaCartLine[]): GaItem[] {
  const items: GaItem[] = [];
  for (const line of lines) {
    const item = toGaItem({
      itemId: line.merchandise?.id || line.merchandise?.product?.id,
      itemName: line.merchandise?.product?.title || line.merchandise?.title,
      price: line.cost?.amountPerQuantity?.amount,
      quantity: line.quantity,
    });
    if (item) items.push(item);
  }
  return items;
}

/**
 * True when the privacy copy already discloses analytics or cookies, so the
 * storefront should not append a second mention.
 */
export function textMentionsAnalyticsOrCookies(text: string): boolean {
  const plain = text.replace(/<[^>]*>/g, " ").replace(/&[a-z]+;/gi, " ");
  return /\b(analytics|cookies?)\b/i.test(plain);
}

export function shouldShowAnalyticsNote(policyHtml: string | null): boolean {
  if (!policyHtml) return true;
  return !textMentionsAnalyticsOrCookies(policyHtml);
}

/** Queue a GA4 ecommerce event. Returns false when the tag is disabled. */
export function trackEcommerce(
  eventName: GaEcommerceEvent,
  items: GaItem[],
): boolean {
  if (!gaMeasurementId()) return false;
  if (eventName !== "view_cart" && items.length === 0) return false;
  return sendGtag("event", eventName, ecommerceParams(items));
}

/**
 * Fire begin_checkout, then navigate. Returns false when GA is disabled so the
 * caller can leave the checkout link's default navigation untouched.
 * A short fallback timeout keeps checkout moving if gtag.js never loads.
 */
export function trackBeginCheckout(
  items: GaItem[],
  navigate: () => void,
): boolean {
  if (!gaMeasurementId() || items.length === 0) return false;
  if (typeof window === "undefined") return false;

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    navigate();
  };

  sendGtag("event", "begin_checkout", {
    ...ecommerceParams(items),
    transport_type: "beacon",
    // Defer so a synchronous gtag callback cannot navigate before the click
    // handler finishes (and before preventDefault runs).
    event_callback: () => {
      setTimeout(finish, 0);
    },
    event_timeout: 400,
  });
  setTimeout(finish, 550);
  return true;
}

function sendGtag(...args: unknown[]): boolean {
  const gtag = ensureGtag();
  if (!gtag) return false;
  gtag(...args);
  return true;
}

function ensureGtag(): ((...args: unknown[]) => void) | null {
  if (typeof window === "undefined" || !gaMeasurementId()) return null;
  const gtagWindow = window as GtagWindow;
  gtagWindow.dataLayer = gtagWindow.dataLayer ?? [];
  if (typeof gtagWindow.gtag !== "function") {
    // Same queue shape as the gtag snippet: push `arguments`, not a plain array.
    gtagWindow.gtag = function gtag() {
      gtagWindow.dataLayer?.push(arguments);
    };
  }
  return gtagWindow.gtag;
}

function normalizePrice(price: number | string | null | undefined): number {
  const value =
    typeof price === "number" ? price : Number.parseFloat(price ?? "");
  if (!Number.isFinite(value) || value < 0) return 0;
  return roundMoney(value);
}

function normalizeQuantity(quantity: number | null | undefined): number {
  if (
    typeof quantity !== "number" ||
    !Number.isFinite(quantity) ||
    quantity < 1
  ) {
    return 1;
  }
  return Math.round(quantity);
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
