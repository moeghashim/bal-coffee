export type Product = {
  name: string;
  slug: string;
  shopifyHandle: string;
  type: string;
  blurb: string;
  price: string;
  description: string;
  notes: string[];
  details: string[];
};

export const products: Product[] = [
  {
    name: "Eastern Brew",
    slug: "eastern-brew",
    shopifyHandle: "arabica",
    type: "Turkish coffee style",
    blurb: "Finely ground for a traditional, rich and bold cup.",
    price: "$24.00",
    description:
      "A finely ground date-seed coffee made for a traditional Turkish-style cup. It brews bold, smooth, and grounding without caffeine.",
    notes: ["Rich body", "Earthy warmth", "Traditional fine grind"],
    details: [
      "Naturally caffeine-free",
      "Made from roasted date seeds",
      "250g bag",
    ],
  },
  {
    name: "GrounDate",
    slug: "groundate",
    shopifyHandle: "groundate",
    type: "Classic brewing",
    blurb: "Perfectly ground for drip or French press.",
    price: "$22.00",
    description:
      "A balanced everyday roast for slower brewing rituals. GrounDate is smooth, comforting, and easy to prepare in classic brewing methods.",
    notes: ["Smooth finish", "Balanced roast", "Drip and French press grind"],
    details: [
      "Naturally caffeine-free",
      "Made from roasted date seeds",
      "250g bag",
    ],
  },
  {
    name: "DateSpresso",
    slug: "datespresso",
    shopifyHandle: "datespresso",
    type: "Pod compatible",
    blurb: "Designed for Nespresso compatible machines.",
    price: "$24.00",
    description:
      "A concentrated date-seed brew designed for quick espresso-style rituals. DateSpresso delivers a deep, cozy cup in a convenient format.",
    notes: ["Deep roast", "Espresso-style cup", "Pod compatible"],
    details: [
      "Naturally caffeine-free",
      "Made from roasted date seeds",
      "10 pods",
    ],
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
