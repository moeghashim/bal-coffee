/**
 * Google Analytics 4 (gtag) for the storefront.
 *
 * The tag and every ecommerce event no-op unless NEXT_PUBLIC_GA_MEASUREMENT_ID
 * is set, so a deploy without that variable does not load gtag or emit events.
 * Payloads are limited to product ids, names, prices, quantities, and USD.
 * Do not add customer fields (name, email, phone, address, payment).
 *
 * `begin_checkout` and `purchase` are intentionally not sent here. Checkout
 * and payment run on Shopify (checkout.balcoffee.com), where the Google &
 * YouTube channel pixel owns begin_checkout (including reloads), plus
 * add_shipping_info, add_payment_info, and purchase. The cart button records
 * `checkout_click` with the same item, value, and currency fields and then
 * lets the anchor navigate so gtag can decorate the href. This module does
 * not change Shopify or the GA4 domain list.
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
  | "checkout_click";

const GA_CONFIG_FLAG = "__balGaConfigured";

type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  [GA_CONFIG_FLAG]?: string;
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

/**
 * Inline bootstrap for the document head. Runs during HTML parse, before React
 * effects, and queues `js` then `config` once. gtag.js drops ecommerce events
 * that sit ahead of `config` in dataLayer, which is how view_item was lost.
 */
export function gtagBootstrapSource(measurementId: string): string {
  if (!MEASUREMENT_ID.test(measurementId)) {
    throw new Error("Invalid GA4 measurement id");
  }
  const id = JSON.stringify(measurementId);
  return (
    "window.dataLayer=window.dataLayer||[];" +
    "window.gtag=window.gtag||function gtag(){window.dataLayer.push(arguments);};" +
    `if(window.${GA_CONFIG_FLAG}!==${id}){` +
    "window.gtag('js',new Date());" +
    `window.gtag('config',${id});` +
    `window.${GA_CONFIG_FLAG}=${id};` +
    "}"
  );
}

/** Queue a GA4 ecommerce event. Returns false when the tag is disabled. */
export function trackEcommerce(
  eventName: GaEcommerceEvent,
  items: GaItem[],
): boolean {
  if (!gaMeasurementId()) return false;
  if (eventName !== "view_cart" && items.length === 0) return false;
  const params = ecommerceParams(items);
  if (eventName !== "checkout_click") {
    return sendGtag("event", eventName, params);
  }
  // Beacon so the hit can leave with the checkout navigation. The caller must
  // not cancel that navigation.
  return sendGtag("event", eventName, {
    ...params,
    transport_type: "beacon",
  });
}

/**
 * Queue checkout_click and return. Does not navigate.
 *
 * The checkout control is an anchor. Leaving its default action in place lets
 * gtag's cross-domain linker decorate the href; beacon transport lets this
 * hit leave with that navigation. Returns false when GA is disabled or there
 * is nothing to report, which also leaves the anchor alone.
 */
export function trackCheckoutClick(items: GaItem[]): boolean {
  return trackEcommerce("checkout_click", items);
}

function sendGtag(...args: unknown[]): boolean {
  const gtag = ensureGtag();
  if (!gtag) return false;
  // Config first. An event already in the queue when gtag.js starts is never
  // delivered, even if `config` is pushed later by the tag snippet.
  ensureGaConfig(gtag);
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

function ensureGaConfig(gtag: (...args: unknown[]) => void) {
  const id = gaMeasurementId();
  if (!id || typeof window === "undefined") return;
  const gtagWindow = window as GtagWindow;
  if (gtagWindow[GA_CONFIG_FLAG] === id) return;
  if (!dataLayerHasConfig(gtagWindow.dataLayer ?? [], id)) {
    gtag("js", new Date());
    gtag("config", id);
  }
  gtagWindow[GA_CONFIG_FLAG] = id;
}

function dataLayerHasConfig(dataLayer: unknown[], measurementId: string) {
  return dataLayer.some((entry) => {
    const command = entry as { 0?: unknown; 1?: unknown };
    return command[0] === "config" && command[1] === measurementId;
  });
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
