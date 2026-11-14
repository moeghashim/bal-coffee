export type EventDrinkCopy = {
  name: string;
  description: string;
  imageSrc: string;
};

// Keyed by Shopify handle. These are the only event-menu claims added in code.
export const EVENT_DRINK_COPY: Record<string, EventDrinkCopy> = {
  "brown-sugar": {
    name: "Brown Sugar",
    description:
      "A DateSpresso shot with brown sugar syrup and your choice of milk. Served iced, or hot if you prefer.",
    imageSrc: "/event/brown-sugar.jpg",
  },
  "caramel-glow": {
    name: "Caramel Glow",
    description:
      "A DateSpresso shot with salted caramel and milk, finished with a caramel drizzle. Served iced, or hot if you prefer.",
    imageSrc: "/event/caramel-glow.jpg",
  },
  "honey-iced-lattee": {
    name: "Honey Iced Latte",
    description:
      "A DateSpresso shot with organic honey and organic milk. Served iced, or hot if you prefer.",
    imageSrc: "/event/honey-iced-lattee.jpg",
  },
  pistachio: {
    name: "Pistachio Caramel",
    description:
      "A DateSpresso shot with pistachio syrup, pistachio cream and milk, finished with a caramel drizzle. Served iced, or hot if you prefer.",
    imageSrc: "/event/pistachio.jpg",
  },
};

export function presentEventDrink(product: {
  shopifyHandle: string;
  name: string;
  description: string;
}) {
  const known = EVENT_DRINK_COPY[product.shopifyHandle];
  if (!known) {
    return {
      name: product.name,
      description: product.description.trim(),
      imageSrc: undefined as string | undefined,
    };
  }
  return {
    name: known.name,
    description: known.description,
    imageSrc: known.imageSrc,
  };
}
