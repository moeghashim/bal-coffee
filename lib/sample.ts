/**
 * 20g sample product. Pure helpers shared by the catalog (server), the sample
 * call to action, and the cart (client). No server-only imports here.
 *
 * Shopify: product handle `sample`, tagged `sample`, one variant per blend
 * (option "Blend"), $0, SKUs BAL-SMP-*. Each is 20g, enough for one cup; the
 * three are the same date seeds in different grinds. One of each per order. It ships from its own "Samples"
 * delivery profile, so the customer pays a separate USPS Ground Advantage rate
 * at checkout. The sample stays out of the public catalog, the sitemap,
 * product JSON-LD, and Merchant Center. The call to action only renders when
 * the Storefront API reports the blend's sample variant as available, so a
 * draft, unpublished, or sold-out sample hides itself.
 */

export const SAMPLE_HANDLE = "sample";
export const SAMPLE_TAG = "sample";
export const SAMPLE_SKU_PREFIX = "BAL-SMP-";
export const SAMPLE_GA_CATEGORY = "sample";
/**
 * Customer-facing terms. Never say "free shipping": shipping is paid. The
 * grind facts below are quoted from lib/products.ts and the Shopify bag
 * descriptions; do not add grind claims that are not there.
 */
export const SAMPLE_TERMS =
  "Each sample is 20g, enough for one cup. All three are the same 100% date seeds; the only difference is the grind size. Each sample is $0, and you pay the USPS Ground Advantage shipping rate shown at checkout. Samples ship separately from any bags. One of each blend per order.";
/** Shorter homepage line. Product pages keep the full terms above. */
export const SAMPLE_TERMS_SHORT =
  "Enough for one cup. The sample is $0; you pay shipping at checkout. Try one blend, or all three.";
/** Quantity allowed for each blend's sample in one order. */
export const SAMPLE_LIMIT_PER_BLEND = 1;

/** Bag handle to the sample variant's "Blend" option value. */
export const SAMPLE_BLENDS: Readonly<Record<string, string>> = {
  datespresso: "DateSpresso",
  groundate: "GrounDate",
  arabica: "Eastern Brew",
};

/** Max sample lines per order: one of each blend. */
export const SAMPLE_MAX_PER_ORDER = Object.keys(SAMPLE_BLENDS).length;

/** Grind and brew method per bag handle, as written on the bag pages. */
export const SAMPLE_GRINDS: Readonly<Record<string, string>> = {
  datespresso: "ground for espresso machines",
  groundate: "ground for traditional coffee machines and pour-over",
  arabica: "ground fine for a Turkish-style cup in a cezve or dallah",
};

export type SampleOffer = {
  merchandiseId: string;
  blend: string;
  bagHandle: string;
  grind: string;
  amount: string;
  currencyCode: string;
};

type SampleSourceVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  sku?: string | null;
  price: { amount: string; currencyCode: string };
  selectedOptions?: { name: string; value: string }[];
};

type SampleSourceProduct = {
  handle: string;
  tags?: string[];
  variants: { nodes: SampleSourceVariant[] };
};

export function isSampleHandle(handle?: string | null): boolean {
  return (handle ?? "").trim().toLowerCase() === SAMPLE_HANDLE;
}

export function isSampleSku(sku?: string | null): boolean {
  return (sku ?? "").trim().toUpperCase().startsWith(SAMPLE_SKU_PREFIX);
}

export function isSampleShopifyProduct(product: {
  handle: string;
  tags?: string[] | null;
}): boolean {
  if (isSampleHandle(product.handle)) return true;
  return (product.tags ?? []).some(
    (tag) => tag.trim().toLowerCase() === SAMPLE_TAG,
  );
}

function blendOf(variant: SampleSourceVariant): string {
  const option = variant.selectedOptions?.find(
    (selected) => selected.name.toLowerCase() === "blend",
  );
  return (option?.value ?? variant.title).trim();
}

/**
 * The sellable sample for one bag, or undefined when there is no sample
 * product, no variant for that blend, or the variant is not available.
 */
export function pickSampleOffer(
  sample: SampleSourceProduct | undefined | null,
  bagHandle: string,
): SampleOffer | undefined {
  const blend = SAMPLE_BLENDS[bagHandle];
  if (!sample || !blend || !isSampleShopifyProduct(sample)) return undefined;
  const variant = sample.variants.nodes.find(
    (node) => blendOf(node).toLowerCase() === blend.toLowerCase(),
  );
  if (!variant || !variant.availableForSale) return undefined;
  return {
    merchandiseId: variant.id,
    blend,
    bagHandle,
    grind: SAMPLE_GRINDS[bagHandle] ?? "",
    amount: variant.price.amount,
    currencyCode: variant.price.currencyCode,
  };
}

/** Available samples in bag order (DateSpresso, GrounDate, Eastern Brew). */
export function pickSampleOffers(
  sample: SampleSourceProduct | undefined | null,
): SampleOffer[] {
  return Object.keys(SAMPLE_BLENDS).flatMap((bagHandle) => {
    const offer = pickSampleOffer(sample, bagHandle);
    return offer ? [offer] : [];
  });
}

type SampleCartLine = {
  quantity?: number | null;
  merchandise?: {
    id?: string | null;
    sku?: string | null;
    product?: { handle?: string | null } | null;
  } | null;
};

export function isSampleCartLine(line: SampleCartLine): boolean {
  return (
    isSampleHandle(line.merchandise?.product?.handle) ||
    isSampleSku(line.merchandise?.sku)
  );
}

/** Total sample units in a cart, across every blend. */
export function sampleUnitsInCart(lines: readonly SampleCartLine[]): number {
  return lines
    .filter(isSampleCartLine)
    .reduce((sum, line) => sum + Math.max(0, line.quantity ?? 0), 0);
}

export function cartHasSample(lines: readonly SampleCartLine[]): boolean {
  return sampleUnitsInCart(lines) > 0;
}

/** Variant ids of the samples already in the cart. */
export function sampleVariantIdsInCart(
  lines: readonly SampleCartLine[],
): Set<string> {
  const ids = new Set<string>();
  for (const line of lines) {
    const id = line.merchandise?.id;
    if (id && isSampleCartLine(line)) ids.add(id);
  }
  return ids;
}

/**
 * True when the cart breaks the one-of-each-blend rule: a sample line above
 * quantity 1, the same blend on two lines, or more than three sample lines.
 */
export function cartExceedsSampleLimit(
  lines: readonly SampleCartLine[],
): boolean {
  const samples = lines.filter(isSampleCartLine);
  if (samples.length > SAMPLE_MAX_PER_ORDER) return true;
  if (samples.some((line) => (line.quantity ?? 0) > SAMPLE_LIMIT_PER_BLEND)) {
    return true;
  }
  const ids = samples
    .map((line) => line.merchandise?.id)
    .filter((id): id is string => Boolean(id));
  return new Set(ids).size !== ids.length;
}

/** Bag handle for a sample line's blend, used to link back to the full bag. */
export function bagHandleForBlend(blend?: string | null): string | undefined {
  const wanted = (blend ?? "").trim().toLowerCase();
  return Object.entries(SAMPLE_BLENDS).find(
    ([, name]) => name.toLowerCase() === wanted,
  )?.[0];
}
