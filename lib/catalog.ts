import "server-only";
import {
  formatPrice,
  getStorefrontProductByHandle,
  getStorefrontProductsByHandles,
} from "lib/commerce";
import { getProduct, products, type Product } from "lib/products";
import type { ShopifyProduct } from "lib/shopify";

/**
 * Shopify-backed catalog reads. Split out from lib/products.ts (the pure,
 * client-safe catalog data + lookups) because these pull the server-only
 * Storefront client through lib/commerce — importing them into a client
 * component would drag `server-only` into the browser bundle.
 */

function normalizeDescription(description: string) {
  return description.replace(/\s+/g, " ").trim();
}

function getShopifyImages(shopifyProduct: ShopifyProduct) {
  const images = [
    ...shopifyProduct.images.nodes,
    ...(shopifyProduct.featuredImage ? [shopifyProduct.featuredImage] : []),
  ];
  const seen = new Set<string>();

  return images.filter((image) => {
    if (!image.url || seen.has(image.url)) {
      return false;
    }

    seen.add(image.url);
    return true;
  });
}

function getSellableVariant(shopifyProduct: ShopifyProduct) {
  const variants = shopifyProduct.variants.nodes;
  return variants.find((variant) => variant.availableForSale) ?? variants[0];
}

function mergeShopifyProduct(product: Product, shopifyProduct: ShopifyProduct) {
  const description = normalizeDescription(shopifyProduct.description);
  const images = getShopifyImages(shopifyProduct);
  const variant = getSellableVariant(shopifyProduct);

  return {
    ...product,
    description: description || product.description,
    price: formatPrice(shopifyProduct.priceRange.minVariantPrice),
    priceAmount: Number(shopifyProduct.priceRange.minVariantPrice.amount),
    currencyCode: shopifyProduct.priceRange.minVariantPrice.currencyCode,
    availableForSale: shopifyProduct.availableForSale,
    merchandiseId: variant?.id,
    variantTitle: variant?.title,
    productId: shopifyProduct.id,
    vendor: shopifyProduct.vendor ?? undefined,
    images,
  };
}

function isStorefrontProduct(
  shopifyProduct?: ShopifyProduct,
): shopifyProduct is ShopifyProduct {
  return Boolean(shopifyProduct && getShopifyImages(shopifyProduct).length > 0);
}

export async function getProducts() {
  const shopifyProducts = await getStorefrontProductsByHandles(
    products.map((product) => product.shopifyHandle),
  );

  return products.flatMap((product) => {
    const shopifyProduct = shopifyProducts.get(product.shopifyHandle);

    return isStorefrontProduct(shopifyProduct)
      ? [mergeShopifyProduct(product, shopifyProduct)]
      : [];
  });
}

export async function getFeaturedProducts() {
  return (await getProducts()).slice(0, 3);
}

export async function getProductWithShopify(slug: string) {
  const product = getProduct(slug);

  if (!product) {
    return undefined;
  }

  try {
    const shopifyProduct = await getStorefrontProductByHandle(
      product.shopifyHandle,
    );

    return isStorefrontProduct(shopifyProduct)
      ? mergeShopifyProduct(product, shopifyProduct)
      : undefined;
  } catch {
    return undefined;
  }
}

export async function getRelatedProductsWithShopify(slug: string) {
  return (await getProducts())
    .filter((product) => product.slug !== slug)
    .slice(0, 3);
}
