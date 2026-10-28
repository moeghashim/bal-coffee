import { shopifyImageUrl } from "lib/images";
import type { Product } from "lib/products";

function priceString(amount: number) {
  return amount.toFixed(2);
}

export function organizationJsonLd(url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BAL Coffee",
    url,
    email: "judy@balcoffee.com",
    logo: `${url}/favicon.ico`,
    description: "Naturally caffeine-free coffee made from roasted date seeds.",
    founder: {
      "@type": "Person",
      name: "Judy Ghashim",
    },
    // City and region come from the Shopify shop profile. No street address
    // is published there, so none is included here.
    address: {
      "@type": "PostalAddress",
      addressLocality: "Houston",
      addressRegion: "TX",
      addressCountry: "US",
    },
  };
}

export function productJsonLd(product: Product, url: string) {
  const images = (product.images ?? [])
    .map((image) => shopifyImageUrl(image.url, 1200))
    .filter((imageUrl) => imageUrl.length > 0);
  const variants = (product.variants ?? []).filter((variant) =>
    Number.isFinite(variant.priceAmount),
  );
  const amounts = variants.map((variant) => variant.priceAmount);
  const currency = variants[0]?.currencyCode || product.currencyCode || "USD";
  const availability = product.availableForSale
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";
  const low = amounts.length > 0 ? Math.min(...amounts) : undefined;
  const high = amounts.length > 0 ? Math.max(...amounts) : undefined;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.blurb,
    brand: {
      "@type": "Brand",
      name: product.vendor || "BAL Coffee",
    },
  };

  if (images.length > 0) data.image = images;
  if (product.sku) data.sku = product.sku;

  // Prices only. No aggregateRating or review — the on-page review count is
  // not backed by a reviews provider.
  if (low !== undefined && high !== undefined && low !== high) {
    data.offers = {
      "@type": "AggregateOffer",
      lowPrice: priceString(low),
      highPrice: priceString(high),
      priceCurrency: currency,
      offerCount: variants.length,
      availability,
      url,
    };
  } else if (low !== undefined) {
    data.offers = {
      "@type": "Offer",
      price: priceString(low),
      priceCurrency: currency,
      availability,
      url,
    };
  }

  return data;
}
