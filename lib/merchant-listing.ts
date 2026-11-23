/**
 * Merchant-listing JSON-LD.
 *
 * /returns: all sales are final. BAL does not accept returns. Damaged or
 * wrong items are handled by emailing judy@balcoffee.com. Do not add a return
 * window, fee, or method.
 *
 * /shipping says the cost is calculated at checkout and that US delivery
 * takes 2–3 business days. MERCHANT_SHIPPING is the one set of figures the
 * Offer publishes. Adjust the rate after Shopify's exact rules are confirmed.
 * Do not invent merchantReturnDays, returnFees, returnMethod, or
 * priceValidUntil.
 */

export const RETURN_NOT_PERMITTED =
  "https://schema.org/MerchantReturnNotPermitted";

/**
 * US merchant-listing shipping. Rate, currency, and day ranges live here so
 * they can change in one place.
 */
export const MERCHANT_SHIPPING = {
  country: "US",
  currency: "USD",
  rate: "8.00",
  handlingDays: { min: 0, max: 1 },
  transitDays: { min: 2, max: 3 },
  unitCode: "DAY",
} as const;

export const BRAND_NAME = "BAL Coffee";
export const CONDITION_LABEL = "New";
export const ITEM_CONDITION = "https://schema.org/NewCondition";
export const IN_STOCK = "https://schema.org/InStock";
export const OUT_OF_STOCK = "https://schema.org/OutOfStock";

const FORMAT_PHRASES = [
  "espresso-style",
  "drip-style",
  "Turkish-style",
  "French press",
  "pour-over",
] as const;

const WEIGHT_UNITS: Record<string, { unitCode: string; suffix: string }> = {
  GRAMS: { unitCode: "GRM", suffix: "g" },
  KILOGRAMS: { unitCode: "KGM", suffix: "kg" },
  OUNCES: { unitCode: "ONZ", suffix: "oz" },
  POUNDS: { unitCode: "LBR", suffix: "lb" },
};

function dayRange(range: { min: number; max: number }) {
  return {
    "@type": "QuantitativeValue" as const,
    minValue: range.min,
    maxValue: range.max,
    unitCode: MERCHANT_SHIPPING.unitCode,
  };
}

export function offerShippingDetails() {
  return {
    "@type": "OfferShippingDetails" as const,
    shippingDestination: {
      "@type": "DefinedRegion" as const,
      addressCountry: MERCHANT_SHIPPING.country,
    },
    shippingRate: {
      "@type": "MonetaryAmount" as const,
      value: MERCHANT_SHIPPING.rate,
      currency: MERCHANT_SHIPPING.currency,
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime" as const,
      handlingTime: dayRange(MERCHANT_SHIPPING.handlingDays),
      transitTime: dayRange(MERCHANT_SHIPPING.transitDays),
    },
  };
}

export function merchantReturnPolicy(siteUrl: string) {
  const origin = siteUrl.replace(/\/$/, "");
  return {
    "@type": "MerchantReturnPolicy" as const,
    applicableCountry: MERCHANT_SHIPPING.country,
    returnPolicyCategory: RETURN_NOT_PERMITTED,
    merchantReturnLink: `${origin}/returns`,
  };
}

/** Same policy on every product, so Organization can carry it too. */
export function organizationCommerceFields(siteUrl: string) {
  return {
    shippingDetails: offerShippingDetails(),
    hasMerchantReturnPolicy: merchantReturnPolicy(siteUrl),
  };
}

export function stockLabel(available: boolean | undefined) {
  return available ? "In stock" : "Out of stock";
}

export function availabilityUrl(available: boolean | undefined) {
  return available ? IN_STOCK : OUT_OF_STOCK;
}

/** Digits that already appear in the visible price string. */
export function schemaPrice(
  amount: number | undefined,
  visiblePrice: string | undefined,
) {
  if (amount === undefined || !Number.isFinite(amount)) return undefined;
  const fixed = amount.toFixed(2);
  const visible = visiblePrice ?? "";
  if (visible.includes(fixed)) return fixed;
  const trimmed = fixed.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
  if (trimmed !== fixed && visible.includes(trimmed)) return trimmed;
  return fixed;
}

export function sizeLabel(value: string | undefined | null) {
  const raw = value?.trim();
  if (!raw || /^default title$/i.test(raw)) return undefined;
  const compact = raw.match(/^(\d+(?:\.\d+)?)(oz|g|lb|kg|ml)$/i);
  const amount = compact?.[1];
  const unit = compact?.[2];
  if (!amount || !unit) return raw;
  return `${amount} ${unit.toLowerCase()}`;
}

export function sizeFromOptions(
  options: { name: string; value: string }[] | undefined,
) {
  const size = options?.find((option) => /^size$/i.test(option.name));
  return sizeLabel(size?.value);
}

/** A brew-format phrase copied from text Shopify already returned. */
export function formatPhrase(description: string | undefined) {
  if (!description) return undefined;
  const text = description
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const lower = text.toLowerCase();
  for (const phrase of FORMAT_PHRASES) {
    const index = lower.indexOf(phrase.toLowerCase());
    if (index !== -1) return text.slice(index, index + phrase.length);
  }
  return undefined;
}

export function weightLabel(
  weight: number | undefined,
  unit: string | undefined,
) {
  if (weight === undefined || !Number.isFinite(weight) || weight <= 0) {
    return undefined;
  }
  const known = unit ? WEIGHT_UNITS[unit.toUpperCase()] : undefined;
  if (!known) return undefined;
  const value = Number.isInteger(weight) ? String(weight) : String(weight);
  return {
    label: `${value} ${known.suffix}`,
    value: weight,
    unitCode: known.unitCode,
  };
}

export function gtinFromBarcode(barcode: string | undefined | null) {
  const digits = barcode?.trim() ?? "";
  if (!/^\d{8}$|^\d{12}$|^\d{13}$|^\d{14}$/.test(digits)) return undefined;
  if (!hasValidGtinCheckDigit(digits)) return undefined;
  const property = `gtin${digits.length}` as
    | "gtin8"
    | "gtin12"
    | "gtin13"
    | "gtin14";
  return { property, value: digits };
}

function hasValidGtinCheckDigit(digits: string) {
  const nums = digits.split("").map(Number);
  const check = nums.pop();
  if (check === undefined) return false;
  let sum = 0;
  for (
    let index = nums.length - 1, place = 0;
    index >= 0;
    index -= 1, place += 1
  ) {
    const digit = nums[index];
    if (digit === undefined) return false;
    sum += digit * (place % 2 === 0 ? 3 : 1);
  }
  return (10 - (sum % 10)) % 10 === check;
}
