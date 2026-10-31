import "server-only";
import { cache } from "react";
import {
  formatPrice,
  getStorefrontCatalog,
  getStorefrontProductsByHandles,
} from "lib/commerce";
import {
  getProductByShopifyHandle,
  products as editorialProducts,
  type Product,
  type ProductVariant,
} from "lib/products";
import type { ShopifyImage, ShopifyProduct, ShopifyVariant } from "lib/shopify";

/**
 * Shopify-backed catalog reads. Editorial copy for the bagged coffees lives in
 * lib/products.ts. Everything else published to the storefront — including café
 * drinks — is built from Shopify fields so prices, variants, and images stay
 * in sync with the shop.
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

function isCafeDrink(shopifyProduct: ShopifyProduct) {
  if (getProductByShopifyHandle(shopifyProduct.handle)) return false;
  const text = `${shopifyProduct.title} ${shopifyProduct.productType ?? ""} ${(shopifyProduct.tags ?? []).join(" ")}`;
  if (
    /latte|café|cafe|pistachio|caramel glow|brown sugar|honey iced|hot latte|\bdrink\b|beverage/i.test(
      text,
    )
  ) {
    return true;
  }
  return (shopifyProduct.options ?? []).some((option) =>
    /milk/i.test(option.name),
  );
}

function blurbFrom(description: string, fallback: string) {
  const clean = normalizeDescription(description);
  if (!clean) return fallback;
  const sentence = clean.split(". ")[0] ?? clean;
  const withPeriod =
    sentence.endsWith(".") || sentence === clean ? sentence : `${sentence}.`;
  return withPeriod.length > 180
    ? `${withPeriod.slice(0, 177).trim()}...`
    : withPeriod;
}

function mapVariant(variant: ShopifyVariant): ProductVariant | undefined {
  if (!variant.id || !variant.price) return undefined;
  return {
    id: variant.id,
    title: variant.title,
    availableForSale: variant.availableForSale,
    sku: variant.sku?.trim() || undefined,
    priceLabel: formatPrice(variant.price),
    priceAmount: Number(variant.price.amount),
    currencyCode: variant.price.currencyCode,
    selectedOptions: variant.selectedOptions ?? [],
    image: variant.image ?? undefined,
  };
}

const BAG_ORDER = ["datespresso", "groundate", "arabica"];

function toCatalogProduct(shopifyProduct: ShopifyProduct): Product {
  const editorial = getProductByShopifyHandle(shopifyProduct.handle);
  const images: ShopifyImage[] = getShopifyImages(shopifyProduct);
  const variants = shopifyProduct.variants.nodes
    .map(mapVariant)
    .filter((variant): variant is ProductVariant => Boolean(variant));
  const selected =
    variants.find((variant) => variant.availableForSale) ?? variants[0];
  const amounts = variants
    .map((variant) => variant.priceAmount)
    .filter((amount) => Number.isFinite(amount));
  const min = amounts.length > 0 ? Math.min(...amounts) : undefined;
  const max = amounts.length > 0 ? Math.max(...amounts) : undefined;
  const priceVaries = min !== undefined && max !== undefined && min !== max;
  const currency =
    selected?.currencyCode ??
    shopifyProduct.priceRange.minVariantPrice.currencyCode;
  const description =
    normalizeDescription(shopifyProduct.description) ||
    editorial?.description ||
    "";
  const drink = isCafeDrink(shopifyProduct);
  const category = editorial ? editorial.category : drink ? "drink" : "other";
  const minMoney =
    min !== undefined
      ? { amount: String(min), currencyCode: currency }
      : shopifyProduct.priceRange.minVariantPrice;

  return {
    ...(editorial ?? {
      name: shopifyProduct.title,
      slug: shopifyProduct.handle,
      shopifyHandle: shopifyProduct.handle,
      type: shopifyProduct.productType || (drink ? "Café drink" : "BAL Coffee"),
      category,
      badge: drink ? "Café" : "",
      blurb: blurbFrom(description, shopifyProduct.title),
      price: "",
      description,
      notes: [],
      details: [],
      benefits: [],
      ingredients: "",
      nutrition: [],
      brewSteps: [],
      kind: drink ? "drink" : "bag-dark",
      accent: "#351c10",
    }),
    category,
    description,
    blurb: editorial?.blurb || blurbFrom(description, shopifyProduct.title),
    price: priceVaries
      ? `From ${formatPrice(minMoney)}`
      : selected
        ? selected.priceLabel
        : formatPrice(shopifyProduct.priceRange.minVariantPrice),
    priceAmount:
      min ?? Number(shopifyProduct.priceRange.minVariantPrice.amount),
    currencyCode: currency,
    availableForSale: shopifyProduct.availableForSale,
    updatedAt: shopifyProduct.updatedAt ?? undefined,
    merchandiseId: selected?.id,
    variantTitle: selected?.title,
    productId: shopifyProduct.id,
    vendor: shopifyProduct.vendor ?? editorial?.vendor,
    sku: selected?.sku,
    images,
    missingImage: images.length === 0,
    variants,
    priceVaries,
  };
}

function orderCatalog(items: Product[]) {
  return [...items].sort((a, b) => {
    const aIndex = BAG_ORDER.indexOf(a.shopifyHandle);
    const bIndex = BAG_ORDER.indexOf(b.shopifyHandle);
    const aRank = aIndex === -1 ? BAG_ORDER.length : aIndex;
    const bRank = bIndex === -1 ? BAG_ORDER.length : bIndex;
    if (aRank !== bRank) return aRank - bRank;
    return a.name.localeCompare(b.name);
  });
}

async function loadShopifyProducts() {
  try {
    const catalog = await getStorefrontCatalog();
    if (catalog.length > 0) return catalog;
  } catch {
    // Fall through to the known bag handles.
  }

  try {
    const byHandle = await getStorefrontProductsByHandles(
      editorialProducts.map((product) => product.shopifyHandle),
    );
    return editorialProducts.flatMap((product) => {
      const shopifyProduct = byHandle.get(product.shopifyHandle);
      return shopifyProduct ? [shopifyProduct] : [];
    });
  } catch {
    return [];
  }
}

export const getProducts = cache(async () => {
  const nodes = await loadShopifyProducts();
  return orderCatalog(nodes.map(toCatalogProduct));
});

export async function getCoffeeProducts() {
  return (await getProducts()).filter(
    (product) => product.category === "coffee",
  );
}

export async function getDrinkProducts() {
  return (await getProducts()).filter(
    (product) => product.category === "drink",
  );
}

export async function getFeaturedProducts() {
  const coffees = await getCoffeeProducts();
  const products = coffees.length > 0 ? coffees : await getProducts();
  return products.slice(0, 3);
}

export async function getProductWithShopify(slug: string) {
  const products = await getProducts();
  return products.find(
    (product) => product.slug === slug || product.shopifyHandle === slug,
  );
}

export async function getRelatedProductsWithShopify(slug: string) {
  const products = await getProducts();
  const current = products.find((product) => product.slug === slug);
  return products
    .filter((product) => product.slug !== slug)
    .sort((a, b) => {
      const aSame = current && a.category === current.category ? 0 : 1;
      const bSame = current && b.category === current.category ? 0 : 1;
      return aSame - bSame;
    })
    .slice(0, 3);
}
