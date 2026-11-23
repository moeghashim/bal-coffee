import type { ShopifyImage } from "lib/shopify";

// Pure, client-safe catalog: static product data, types, and slug/handle
// lookups. Shopify-backed reads live in lib/catalog.ts (server-only) so this
// module can be imported from client components without pulling `server-only`.

export type ProductKind = "bag-dark" | "bag-light" | "bag-green" | "drink";

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  sku?: string;
  barcode?: string;
  weight?: number;
  weightUnit?: string;
  priceLabel: string;
  priceAmount: number;
  currencyCode: string;
  selectedOptions: { name: string; value: string }[];
  image?: ShopifyImage;
};

export type Product = {
  name: string;
  slug: string;
  shopifyHandle: string;
  type: string;
  category: "coffee" | "drink" | "other";
  badge: string;
  blurb: string;
  price: string;
  description: string;
  capsule?: string;
  descriptionLines?: string[];
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
  // First sellable Shopify variant GID — the merchandiseId the Hydrogen cart
  // adds to the cart. Present only after a product is merged with live data.
  merchandiseId?: string;
  // Shopify Product GID + vendor + variant title, for PRODUCT_VIEWED analytics.
  // Merge-only.
  productId?: string;
  vendor?: string;
  variantTitle?: string;
  sku?: string;
  barcode?: string;
  weight?: number;
  weightUnit?: string;
  /** Shopify Size option, spaced ("12 oz"). Absent when Shopify has no size. */
  size?: string;
  /** Brew-format phrase copied from the Shopify description. */
  format?: string;
  updatedAt?: string;
  variants?: ProductVariant[];
  priceVaries?: boolean;
  // True when Shopify has no image for this product. UI shows an illustration.
  missingImage?: boolean;
};

export function variantLabel(variant: ProductVariant) {
  const meaningful = variant.selectedOptions.filter(
    (option) => option.name !== "Title" && option.value !== "Default Title",
  );
  if (meaningful.length === 0) return variant.title;
  return meaningful.map((option) => option.value).join(" · ");
}

export function productImageAlt(
  product: Pick<Product, "name" | "category" | "type">,
  image?: ShopifyImage | null,
) {
  const fromShopify = image?.altText?.trim();
  if (fromShopify) return fromShopify;
  if (product.category === "drink") {
    return `${product.name} café drink`;
  }
  return `${product.name}, caffeine-free date-seed coffee`;
}

export const products: Product[] = [
  {
    name: "DateSpresso",
    slug: "datespresso",
    shopifyHandle: "datespresso",
    type: "Espresso-style depth",
    category: "coffee",
    badge: "",
    blurb: "Bold & indulgent with espresso-style depth.",
    price: "$27",
    description:
      "Bold and indulgent with espresso-style depth. Crafted from roasted date seeds, DateSpresso is a rich, smooth cup that is naturally caffeine-free.",
    capsule:
      "DateSpresso is roasted date seed coffee ground for espresso machines. It is 100% date seeds, naturally caffeine-free and roasted in small batches, with no coffee beans and no additives or preservatives. Use it in any espresso machine, ideally with a dual-wall filter, for lattes and iced drinks.",
    notes: ["Rich", "Bold", "Indulgent"],
    details: [
      "Naturally caffeine-free",
      "Roasted date seed coffee",
      "12oz resealable bag",
    ],
    benefits: [
      "Espresso-style depth without the caffeine",
      "Made from roasted date seeds",
      "No coffee beans",
      "Roasted in small batches",
    ],
    ingredients: "Roasted date seeds.",
    nutrition: [],
    brewSteps: [
      {
        title: "Use",
        body: "Your DateSpresso can be used in any espresso machine.",
      },
      {
        title: "Filter or setting",
        body: "We recommend using a dual-wall filter or a stronger setting than you would for fresh ground espresso.",
      },
      {
        title: "Enjoy",
        body: "DateSpresso pairs well with oat milk. Enjoy!",
      },
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
    capsule:
      "GrounDate is roasted date seed coffee ground for traditional coffee machines and pour-over, and it works as cold brew too. It is 100% date seeds, naturally caffeine-free and acid-free, with no coffee beans and no additives or preservatives. For cold brew, use 1 part grounds to 4 parts water by volume and steep 12–24 hours.",
    notes: ["Smooth", "Balanced", "Mellow"],
    details: [
      "Naturally caffeine-free",
      "Roasted date seed coffee",
      "12oz resealable bag",
    ],
    benefits: [
      "For drip, French press, pour-over, and cold brew",
      "Made from roasted date seeds",
      "No coffee beans",
      "Roasted for everyday brewing",
    ],
    ingredients: "Roasted date seeds.",
    nutrition: [],
    brewSteps: [
      {
        title: "Hot brew",
        body: "Use your BAL Coffee grounds in any traditional coffee machine or pour-over. Enjoy!",
      },
      {
        title: "Cold brew",
        body: "Use a 1:4 ratio (1 part GrounDate grounds to 4 parts water) and steep 12-24 hours.",
      },
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
    badge: "Turkish-style",
    blurb: "A fine grind for a Turkish-style cup.",
    price: "$27",
    description:
      "A finely ground date-seed coffee made for a traditional Turkish-style cup. It brews bold and smooth, without caffeine.",
    capsule:
      "Eastern Brew is roasted date seed coffee ground fine for a Turkish-style cup in a cezve or dallah. It is 100% date seeds, naturally caffeine-free and acid-free, with no coffee beans and no additives or preservatives. Use one heaping teaspoon per 2 oz cup of water and boil for 1–2 minutes.",
    notes: ["Warm", "Roasted", "Fine grind"],
    details: [
      "Naturally caffeine-free",
      "Fine Turkish-style grind",
      "12oz resealable bag",
    ],
    benefits: [
      "Fine grind for a Turkish-style cup",
      "Made from roasted date seeds",
      "No coffee beans",
      "Roasted in small batches",
    ],
    ingredients: "Roasted date seeds.",
    nutrition: [],
    brewSteps: [
      {
        title: "Heat",
        body: "Heat one small 2 oz cup of water per serving in a cezve or dallah (or any small pot).",
      },
      {
        title: "Add",
        body: "Just before it comes to a boil, add one heaping teaspoon of BAL Coffee Eastern Brew per serving and stir.",
      },
      {
        title: "Boil and serve",
        body: "Allow to boil for 1-2 minutes, then serve immediately. Enjoy!",
      },
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
