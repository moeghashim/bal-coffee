import {
  formatPrice,
  getStorefrontProductByHandle,
  getStorefrontProductsByHandles,
} from "lib/commerce";
import type { ShopifyImage, ShopifyProduct } from "lib/shopify";

export type ProductKind = "bag-dark" | "bag-light" | "bag-green";

export type Product = {
  name: string;
  slug: string;
  shopifyHandle: string;
  type: string;
  category: "coffee" | "gift";
  badge: string;
  blurb: string;
  price: string;
  description: string;
  notes: string[];
  details: string[];
  benefits: string[];
  ingredients: string;
  nutrition: { label: string; value: string }[];
  brewSteps: { title: string; body: string }[];
  kind: ProductKind;
  accent: string;
  availableForSale?: boolean;
  images?: ShopifyImage[];
  priceAmount?: number;
  currencyCode?: string;
};

export const products: Product[] = [
  {
    name: "DateSpresso",
    slug: "datespresso",
    shopifyHandle: "datespresso",
    type: "Espresso-style depth",
    category: "coffee",
    badge: "Best Seller",
    blurb: "Bold & indulgent with espresso-style depth.",
    price: "$27",
    description:
      "Bold and indulgent with espresso-style depth. Crafted from roasted date seeds, DateSpresso delivers a rich, smooth cup that is naturally caffeine-free and full of feel-good benefits.",
    notes: ["Rich", "Bold", "Indulgent"],
    details: [
      "Naturally caffeine-free",
      "Roasted date seed coffee",
      "12oz resealable bag",
    ],
    benefits: [
      "Espresso-style depth without the caffeine",
      "Supports gut health with natural prebiotics",
      "Made from upcycled date seeds",
      "Smooth, rich, and deeply satisfying",
      "Roasted in small batches with care",
    ],
    ingredients: "Roasted date seeds.",
    nutrition: [
      { label: "Calories", value: "10" },
      { label: "Carbohydrates", value: "2g" },
      { label: "Dietary Fiber", value: "1g" },
      { label: "Prebiotics", value: "1g" },
    ],
    brewSteps: [
      { title: "Scoop", body: "Add 1-2 tsp to your cup." },
      { title: "Pour", body: "Add 8 oz hot water." },
      { title: "Stir & Enjoy", body: "Stir well and savor." },
    ],
    kind: "bag-dark",
    accent: "#351c10",
  },
  {
    name: "GrounDate",
    slug: "groundate",
    shopifyHandle: "groundate",
    type: "Balanced daily brew",
    category: "coffee",
    badge: "Caffeine-Free",
    blurb: "Smooth & balanced for everyday moments.",
    price: "$27",
    description:
      "A smooth, balanced date-seed brew made for everyday rituals. GrounDate has a mellow roasted profile that works beautifully as a classic hot cup.",
    notes: ["Smooth", "Balanced", "Mellow"],
    details: [
      "Naturally caffeine-free",
      "Roasted date seed coffee",
      "12oz resealable bag",
    ],
    benefits: [
      "Gentle enough for morning or night",
      "Naturally prebiotic-rich",
      "Made from upcycled date seeds",
      "Smooth flavor without acidity",
      "Roasted for everyday brewing",
    ],
    ingredients: "Roasted date seeds.",
    nutrition: [
      { label: "Calories", value: "10" },
      { label: "Carbohydrates", value: "2g" },
      { label: "Dietary Fiber", value: "1g" },
      { label: "Prebiotics", value: "1g" },
    ],
    brewSteps: [
      { title: "Scoop", body: "Add 1-2 tsp to your brewer." },
      { title: "Pour", body: "Use hot water just off boil." },
      { title: "Sip", body: "Enjoy smooth roasted depth." },
    ],
    kind: "bag-light",
    accent: "#efe3c8",
  },
  {
    name: "Eastern Brew",
    slug: "eastern-brew",
    shopifyHandle: "arabica",
    type: "Turkish coffee style",
    category: "coffee",
    badge: "Prebiotic-Rich",
    blurb: "Warm spices and tradition in every comforting sip.",
    price: "$27",
    description:
      "A finely ground date-seed coffee made for a traditional Turkish-style cup. It brews bold, smooth, and grounding without caffeine.",
    notes: ["Warm", "Spiced", "Aromatic"],
    details: [
      "Naturally caffeine-free",
      "Fine Turkish-style grind",
      "12oz resealable bag",
    ],
    benefits: [
      "Traditional depth without caffeine",
      "Supports evening rituals",
      "Made from upcycled date seeds",
      "Warm, aromatic finish",
      "Roasted in small batches",
    ],
    ingredients: "Roasted date seeds.",
    nutrition: [
      { label: "Calories", value: "10" },
      { label: "Carbohydrates", value: "2g" },
      { label: "Dietary Fiber", value: "1g" },
      { label: "Prebiotics", value: "1g" },
    ],
    brewSteps: [
      { title: "Scoop", body: "Add fine grounds to cezve." },
      { title: "Heat", body: "Warm gently with water." },
      { title: "Serve", body: "Pour slowly and enjoy." },
    ],
    kind: "bag-green",
    accent: "#34411f",
  },
];

export const featuredProducts = products.slice(0, 3);

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductByShopifyHandle(handle: string) {
  return products.find((product) => product.shopifyHandle === handle);
}

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

function mergeShopifyProduct(product: Product, shopifyProduct: ShopifyProduct) {
  const description = normalizeDescription(shopifyProduct.description);
  const images = getShopifyImages(shopifyProduct);

  return {
    ...product,
    description: description || product.description,
    price: formatPrice(shopifyProduct.priceRange.minVariantPrice),
    priceAmount: Number(shopifyProduct.priceRange.minVariantPrice.amount),
    currencyCode: shopifyProduct.priceRange.minVariantPrice.currencyCode,
    availableForSale: shopifyProduct.availableForSale,
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
