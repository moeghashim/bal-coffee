import { formatMoney, type MoneyV2 } from "@shopify/hydrogen";

/**
 * Money formatting via Hydrogen's correct-by-default `formatMoney` (see the
 * hydrogen-money skill). Replaces the hand-rolled Intl formatting so amounts
 * always match Shopify to the cent.
 *
 * Default presentation drops trailing zeros ($27, $27.50) to preserve the
 * storefront's existing look; pass `withCents` for always-two-decimals contexts
 * like cart totals and tax.
 */
export function formatPrice(
  money: MoneyV2,
  options: { locale?: string; withCents?: boolean } = {},
): string {
  const { locale = "en-US", withCents = false } = options;
  const formatted = formatMoney(money, { locale });
  return withCents ? formatted.toString() : formatted.withoutTrailingZeros;
}
