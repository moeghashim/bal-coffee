const CHECKOUT_HOSTS = new Set(["balcoffee.com", "checkout.shopify.com"]);

/** Shopify-hosted checkout only. The cart key in the URL is a payment secret. */
export function isAllowedCheckoutUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    const host = url.hostname.toLowerCase();
    if (CHECKOUT_HOSTS.has(host)) return true;
    if (host.endsWith(".balcoffee.com")) return true;
    if (host.endsWith(".myshopify.com")) return true;
    if (host.endsWith(".shopify.com")) return true;
    return false;
  } catch {
    return false;
  }
}
