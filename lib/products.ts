export type ProductKind =
  | "bag-dark"
  | "bag-light"
  | "bag-green"
  | "latte"
  | "dessert"
  | "iced";

export type Product = {
  name: string;
  slug: string;
  shopifyHandle: string;
  type: string;
  category: "coffee" | "drink" | "gift";
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
  {
    name: "Hot Latte",
    slug: "hot-latte",
    shopifyHandle: "brown-sugar-bliss",
    type: "Creamy caffeine-free cup",
    category: "drink",
    badge: "Caffeine-Free",
    blurb: "Creamy, cozy & perfectly caffeine-free.",
    price: "$7",
    description:
      "A warm latte-style date-seed drink with a creamy body, gentle roast, and cozy finish.",
    notes: ["Creamy", "Cozy", "Soft"],
    details: ["Naturally caffeine-free", "Prepared fresh", "Single serving"],
    benefits: [
      "A warm cafe ritual without caffeine",
      "Smooth and gentle on the body",
      "Roasted date seed base",
      "Creamy comfort in every sip",
      "Made for any time of day",
    ],
    ingredients: "Roasted date seed brew, milk.",
    nutrition: [
      { label: "Calories", value: "90" },
      { label: "Carbohydrates", value: "11g" },
      { label: "Dietary Fiber", value: "1g" },
      { label: "Prebiotics", value: "1g" },
    ],
    brewSteps: [
      { title: "Brew", body: "Prepare date-seed coffee." },
      { title: "Steam", body: "Warm milk until silky." },
      { title: "Pour", body: "Combine and sip slowly." },
    ],
    kind: "latte",
    accent: "#b88b5a",
  },
  {
    name: "Tiramisu Dream",
    slug: "tiramisu-dream",
    shopifyHandle: "tiramisu-dream",
    type: "Layered dessert cup",
    category: "drink",
    badge: "Best Seller",
    blurb: "Decadent layers with a hint of cocoa bliss.",
    price: "$7",
    description:
      "A layered dessert-inspired date-seed drink with cocoa, creamy texture, and a smooth roasted finish.",
    notes: ["Cocoa", "Creamy", "Layered"],
    details: ["Naturally caffeine-free", "Prepared fresh", "Single serving"],
    benefits: [
      "Dessert-like without the caffeine",
      "Smooth roasted date-seed base",
      "Layered creamy finish",
      "Comforting cocoa notes",
      "Made fresh to order",
    ],
    ingredients: "Roasted date seed brew, milk, cocoa.",
    nutrition: [
      { label: "Calories", value: "120" },
      { label: "Carbohydrates", value: "18g" },
      { label: "Dietary Fiber", value: "1g" },
      { label: "Prebiotics", value: "1g" },
    ],
    brewSteps: [
      { title: "Layer", body: "Start with creamy base." },
      { title: "Brew", body: "Add roasted date-seed cup." },
      { title: "Finish", body: "Dust cocoa and enjoy." },
    ],
    kind: "dessert",
    accent: "#4a2a18",
  },
  {
    name: "Caramel Glow",
    slug: "caramel-glow",
    shopifyHandle: "caramel-glow",
    type: "Iced caramel ritual",
    category: "drink",
    badge: "Prebiotic-Rich",
    blurb: "Buttery caramel with a smooth, nutty finish.",
    price: "$7",
    description:
      "A chilled date-seed drink with buttery caramel, a nutty finish, and a smooth caffeine-free base.",
    notes: ["Caramel", "Nutty", "Smooth"],
    details: ["Naturally caffeine-free", "Prepared fresh", "Single serving"],
    benefits: [
      "Refreshing without caffeine",
      "Smooth date-seed base",
      "Buttery caramel finish",
      "Naturally prebiotic-rich",
      "Made for slow afternoon rituals",
    ],
    ingredients: "Roasted date seed brew, milk, caramel.",
    nutrition: [
      { label: "Calories", value: "130" },
      { label: "Carbohydrates", value: "20g" },
      { label: "Dietary Fiber", value: "1g" },
      { label: "Prebiotics", value: "1g" },
    ],
    brewSteps: [
      { title: "Ice", body: "Fill glass with ice." },
      { title: "Pour", body: "Add brew and milk." },
      { title: "Glow", body: "Finish with caramel." },
    ],
    kind: "iced",
    accent: "#c98542",
  },
];

export const featuredProducts = products.slice(0, 3);

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(slug: string) {
  return products.filter((product) => product.slug !== slug).slice(0, 3);
}
