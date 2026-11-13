import { productImageAlt, variantLabel, type Product } from "lib/products";

export type EventMenuVariant = {
  id: string;
  label: string;
  available: boolean;
  priceLabel: string;
  priceAmount: number;
  currencyCode: string;
};

export type EventMenuDrink = {
  handle: string;
  name: string;
  imageUrl?: string;
  imageAlt: string;
  variants: EventMenuVariant[];
};

export function toEventMenuDrink(product: Product): EventMenuDrink | null {
  const variants: EventMenuVariant[] = [];
  for (const variant of product.variants ?? []) {
    if (!variant.id) continue;
    const label = variantLabel(variant);
    variants.push({
      id: variant.id,
      label: label === "Default Title" ? "" : label,
      available: variant.availableForSale,
      priceLabel: variant.priceLabel,
      priceAmount: variant.priceAmount,
      currencyCode: variant.currencyCode,
    });
  }

  if (
    variants.length === 0 &&
    product.merchandiseId &&
    product.priceAmount != null &&
    product.currencyCode
  ) {
    const label = product.variantTitle;
    variants.push({
      id: product.merchandiseId,
      label: !label || label === "Default Title" ? "" : label,
      available: product.availableForSale !== false,
      priceLabel: product.price,
      priceAmount: product.priceAmount,
      currencyCode: product.currencyCode,
    });
  }

  if (variants.length === 0) return null;
  const image = product.images?.[0];
  return {
    handle: product.shopifyHandle,
    name: product.name,
    imageUrl: image?.url,
    imageAlt: productImageAlt(product, image),
    variants,
  };
}
