import { shopifyImageUrl } from "./images";
import {
  availabilityUrl,
  BRAND_NAME,
  gtinFromBarcode,
  ITEM_CONDITION,
  merchantReturnPolicy,
  offerShippingDetails,
  schemaPrice,
  weightLabel,
} from "./merchant-listing";
import type { Product } from "./products";
import { plainText } from "./plain-text";

function priceString(amount: number) {
  return amount.toFixed(2);
}

function absoluteImage(url: string) {
  const sized = shopifyImageUrl(url, 1200);
  if (sized.startsWith("//")) return `https:${sized}`;
  return sized;
}

function offerCommerce(siteUrl: string) {
  return {
    shippingDetails: offerShippingDetails(),
    hasMerchantReturnPolicy: merchantReturnPolicy(siteUrl),
    itemCondition: ITEM_CONDITION,
  };
}

export function productJsonLd(
  product: Product,
  url: string,
  description?: string,
) {
  const images = (product.images ?? [])
    .map((image) => absoluteImage(image.url))
    .filter((imageUrl) => imageUrl.startsWith("http"));
  const variants = (product.variants ?? []).filter((variant) =>
    Number.isFinite(variant.priceAmount),
  );
  const amounts = variants.map((variant) => variant.priceAmount);
  const currency = variants[0]?.currencyCode || product.currencyCode || "USD";
  const availability = availabilityUrl(product.availableForSale);
  const low = amounts.length > 0 ? Math.min(...amounts) : product.priceAmount;
  const high = amounts.length > 0 ? Math.max(...amounts) : product.priceAmount;
  const schemaDescription = plainText(
    product.description || description || product.blurb || product.name,
  );
  const siteUrl = new URL(url).origin;
  const commerce = offerCommerce(siteUrl);
  const weight = weightLabel(product.weight, product.weightUnit);
  const gtin = gtinFromBarcode(product.barcode);
  const sku = product.sku?.trim();

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: schemaDescription,
    brand: {
      "@type": "Brand",
      name: BRAND_NAME,
    },
  };

  if (images.length > 0) data.image = images;
  if (sku) data.sku = sku;
  if (gtin) data[gtin.property] = gtin.value;
  if (product.size) data.size = product.size;
  if (weight) {
    data.weight = {
      "@type": "QuantitativeValue",
      value: weight.value,
      unitCode: weight.unitCode,
    };
  }

  const additionalProperty = [
    product.size
      ? { "@type": "PropertyValue", name: "Size", value: product.size }
      : undefined,
    weight
      ? { "@type": "PropertyValue", name: "Weight", value: weight.label }
      : undefined,
    product.format
      ? { "@type": "PropertyValue", name: "Format", value: product.format }
      : undefined,
  ].filter((entry) => entry !== undefined);
  if (additionalProperty.length > 0) {
    data.additionalProperty = additionalProperty;
  }

  if (low !== undefined && high !== undefined && low !== high) {
    data.offers = {
      "@type": "AggregateOffer",
      lowPrice: priceString(low),
      highPrice: priceString(high),
      priceCurrency: currency,
      offerCount: variants.length,
      availability,
      url,
      ...commerce,
    };
  } else if (low !== undefined) {
    const visible = schemaPrice(low, product.price) ?? priceString(low);
    data.offers = {
      "@type": "Offer",
      price: visible,
      priceCurrency: currency,
      availability,
      url,
      ...commerce,
    };
  }

  return data;
}
